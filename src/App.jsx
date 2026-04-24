import React, { useState, useEffect, useMemo } from 'react';
import {
  Play, User, Scissors, ShoppingBag, Smartphone, Menu, X,
  ArrowRight, Heart, Camera, ChevronRight, Star, Gift,
  Briefcase, MessageSquare, CheckCircle, ShoppingCart,
  MapPin, Clock, Truck, HelpCircle, Share2, Info, ChevronLeft,
  Filter, Video, Award, MousePointerClick, TrendingUp, Users, Activity
} from 'lucide-react';


// 导入静态资源
// 图片改为本地引入 (132kB 体积小，本地引入更稳定，避免 CDN 挂掉导致背景全白)
// 图片改为本地引入 (132kB 体积小，本地引入更稳定，避免 CDN 挂掉导致背景全白)
import homeBg from './assets/home_bg.webp';
import papercutPanelImg from './assets/pictures/optimized/2.jpg';
import bookmarkImg from './assets/pictures/optimized/书签6.jpg';
import toteBagImg from './assets/pictures/optimized/帆布包1.jpg';
import postcardImg from './assets/pictures/optimized/明信片4.jpg';
import mugImg from './assets/pictures/optimized/杯子2.jpg';
import tableMatImg from './assets/pictures/optimized/桌垫3.jpg';
import bowlImg from './assets/pictures/optimized/碗5.jpg';
// 视频封面图 (默认使用首页背景，如需更换请上传新图并修改此处引用)
const videoCover = homeBg;

const redLanternGiftImg = "https://images.pexels.com/photos/20767138/pexels-photo-20767138.png?auto=compress&cs=tinysrgb&w=500";
const redLanternGiftSource = "https://www.pexels.com/photo/close-up-of-red-paper-lanterns-with-chinese-writing-20767138/";
const redPaperDiyImg = "https://images.pexels.com/photos/20541861/pexels-photo-20541861.jpeg?auto=compress&cs=tinysrgb&w=500";
const redPaperDiySource = "https://www.pexels.com/photo/hands-of-a-person-making-red-paper-decorations-20541861/";

const formatPrice = (price) => Number.isInteger(price) ? String(price) : price.toFixed(1);
const getOriginalPrice = (price) => Math.ceil(price * 1.25);

const HENAN_GEOJSON_URL = 'https://geo.datav.aliyun.com/areas_v3/bound/410000_full.json';
const HENAN_MAP_FALLBACK_BOUNDS = { minLng: 110.35, maxLng: 116.7, minLat: 31.35, maxLat: 36.45 };
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 560;

const cityFillPalette = ['#e7f0dd', '#f4ead4', '#eaf2df', '#f1e3c8', '#e0eddc', '#f6efd9', '#e8f1e3', '#f0e7d3'];

const henanCityLabels = [
  { name: '郑州', lng: 113.62, lat: 34.75, major: true },
  { name: '洛阳', lng: 112.45, lat: 34.62, major: true },
  { name: '三门峡', lng: 111.2, lat: 34.78, major: true },
  { name: '开封', lng: 114.31, lat: 34.8, major: true },
  { name: '商丘', lng: 115.65, lat: 34.45, major: true },
  { name: '许昌', lng: 113.85, lat: 34.02 },
  { name: '新乡', lng: 113.92, lat: 35.3 },
  { name: '安阳', lng: 114.35, lat: 36.1 },
  { name: '南阳', lng: 112.52, lat: 33.0 },
  { name: '信阳', lng: 114.08, lat: 32.13 },
  { name: '周口', lng: 114.65, lat: 33.62 },
  { name: '驻马店', lng: 114.02, lat: 32.98 },
  { name: '焦作', lng: 113.24, lat: 35.22 },
  { name: '平顶山', lng: 113.3, lat: 33.74 }
];

const henanRiverLines = [
  {
    name: '黄河',
    width: 9,
    coords: [[110.55, 34.72], [111.25, 34.74], [112.05, 34.68], [112.85, 34.82], [113.55, 34.95], [114.25, 34.87], [115.05, 35.03], [116.25, 35.42]]
  },
  {
    name: '淮河',
    width: 4,
    coords: [[112.95, 32.32], [113.65, 32.28], [114.35, 32.23], [115.15, 32.05]]
  }
];

const henanLogisticsRoutes = [
  [[111.1, 34.72], [112.45, 34.62], [113.62, 34.75], [114.31, 34.8], [115.65, 34.45]],
  [[112.45, 34.62], [113.3, 33.74], [114.02, 33.58], [114.65, 33.62]],
  [[113.62, 34.75], [113.85, 34.02], [114.02, 32.98], [114.08, 32.13]]
];

const collectCoordinatePairs = (value, acc = []) => {
  if (!Array.isArray(value)) return acc;
  if (typeof value[0] === 'number' && typeof value[1] === 'number') {
    acc.push(value);
    return acc;
  }
  value.forEach((item) => collectCoordinatePairs(item, acc));
  return acc;
};

const getGeoJsonBounds = (geoJson) => {
  const pairs = collectCoordinatePairs(geoJson?.features?.map((feature) => feature.geometry?.coordinates) || []);
  if (!pairs.length) return null;

  return pairs.reduce((bounds, [lng, lat]) => ({
    minLng: Math.min(bounds.minLng, lng),
    maxLng: Math.max(bounds.maxLng, lng),
    minLat: Math.min(bounds.minLat, lat),
    maxLat: Math.max(bounds.maxLat, lat)
  }), { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity });
};

const createMapProjector = (bounds) => {
  const paddingX = 68;
  const paddingY = 42;
  const lngSpan = bounds.maxLng - bounds.minLng;
  const latSpan = bounds.maxLat - bounds.minLat;
  const scale = Math.min((MAP_WIDTH - paddingX * 2) / lngSpan, (MAP_HEIGHT - paddingY * 2) / latSpan);
  const mapWidth = lngSpan * scale;
  const mapHeight = latSpan * scale;
  const offsetX = (MAP_WIDTH - mapWidth) / 2;
  const offsetY = (MAP_HEIGHT - mapHeight) / 2;

  return (lng, lat) => ({
    x: offsetX + (lng - bounds.minLng) * scale,
    y: offsetY + (bounds.maxLat - lat) * scale
  });
};

const ringToPath = (ring, project) => {
  const points = ring.map(([lng, lat]) => project(lng, lat));
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ') + ' Z';
};

const geometryToPaths = (geometry, project) => {
  if (!geometry?.coordinates) return [];
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flatMap((polygon) => polygon.map((ring) => ringToPath(ring, project)));
};

const lineToPath = (coords, project) => coords
  .map(([lng, lat], index) => {
    const point = project(lng, lat);
    return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  })
  .join(' ');

// --- 模拟数据 ---

// 银发传承人 & 青年设计师数据
// 银发传承人 & 青年设计师数据 (多组)
const profilePairs = [
  {
    id: 1,
    inheritor: {
      name: "王秀英",
      age: 72,
      title: "国家级非遗传承人",
      role: "陕州剪纸 / 拉手娃娃",
      desc: "剪纸六十余载，一把剪刀剪出中原大地的悲欢离合。坚持传统技法，不用画稿，随心而剪。",
      tags: ["陕州剪纸", "国宝级"],
      timeline: [
        { year: "1965", event: "12岁开始随母学习剪纸" },
        { year: "1995", event: "作品《牡丹图》被中国美术馆收藏" },
        { year: "2008", event: "被评为国家级非物质文化遗产传承人" }
      ]
    },
    designer: {
      name: "林晓",
      age: 24,
      title: "新锐视觉设计师",
      role: "视觉传达 / 95后",
      desc: "非遗不应该被供在博物馆里。我想用设计语言翻译它，让它变成潮玩、变成表情包，重新回到年轻人的生活里。",
      tags: ["央美毕业", "红点奖得主"],
      timeline: [
        { year: "2023", event: "毕业设计《纸间代码》获金奖" },
        { year: "2024", event: "加入剪韵中原项目，负责纹样矢量化" },
        { year: "2025", event: "主导设计《生肖·潮》系列文创" }
      ]
    }
  },
  {
    id: 2,
    inheritor: {
      name: "王姥姥",
      age: 68,
      title: "省级非遗传承人",
      role: "蔚县剪纸 / 戏曲人物",
      desc: "一剪剪出杨门女将，一刀刻下三国风云。王姥姥的戏曲人物剪纸，神形兼备，活灵活现。",
      tags: ["蔚县剪纸", "戏曲迷"],
      timeline: [
        { year: "1970", event: "师从民间艺人学习刻纸" },
        { year: "2005", event: "作品获奖无数" },
        { year: "2015", event: "致力于戏曲剪纸的推广" }
      ]
    },
    designer: {
      name: "张设计",
      age: 28,
      title: "资深文创策划",
      role: "产品设计 / 80后",
      desc: "将戏曲元素符号化，打造符合现代审美的国潮IP。让年轻人通过潮玩了解传统戏曲文化。",
      tags: ["红点奖", "国潮推手"],
      timeline: [
        { year: "2018", event: "成立个人设计工作室" },
        { year: "2020", event: "设计《戏·剪》系列盲盒" },
        { year: "2024", event: "联合王姥姥开发戏曲周边" }
      ]
    }
  },
  {
    id: 3,
    inheritor: {
      name: "刘大爷",
      age: 75,
      title: "市级非遗传承人",
      role: "河洛剪纸 / 民俗风情",
      desc: "擅长捕捉黄河之滨的市井与乡土瞬间，将中原大地的烟火气剪进纸里，风格细腻写实。",
      tags: ["河洛风格", "老匠人"],
      timeline: [
        { year: "1960", event: "自幼酷爱剪纸艺术" },
        { year: "1990", event: "多次参加国内外展览" },
        { year: "2018", event: "被评为社区文化带头人" }
      ]
    },
    designer: {
      name: "李创意",
      age: 26,
      title: "新媒体艺术家",
      role: "数字艺术 / 00后",
      desc: "尝试用AR/VR技术赋予剪纸新的生命，让静态的纹样在屏幕中动起来，讲述古老的故事。",
      tags: ["数字艺术", "科技融合"],
      timeline: [
        { year: "2022", event: "获数字文创大赛金奖" },
        { year: "2023", event: "开发非遗AR体验应用" },
        { year: "2025", event: "策划沉浸式剪纸光影展" }
      ]
    }
  }
];

// AR页问答数据
const faqData = [
  { q: "刚开始学剪纸，该选什么样的剪刀和纸张？", a: "剪刀选刃口锋利、手柄贴合手型的剪纸专用小剪刀；纸张优先选120–150克的大红宣纸或剪纸专用红纸。" },
  { q: "剪出来的图案边缘不光滑，总是有毛边怎么办？", a: "确保剪刀锋利；保持剪刀与纸张垂直，匀速移动纸张；可用细砂纸或镊子修整。" },
  { q: "折叠剪纸时，怎么保证折痕对称、图案剪出来不歪？", a: "指甲或骨笔压实折痕；复杂团花先标记角度（五折72°、六折60°）；剪前用铅笔描轮廓。" },
  { q: "想剪复杂的人物或花鸟图案，总是不知道从哪里下剪？", a: "遵循“先内后外、先细后粗”原则；大图案可拆分剪裁再整合。" },
  { q: "剪纸作品容易破损，怎么保存和装裱？", a: "夹在厚卡纸或透明文件袋中；装裱可用简易卡纸托裱法，固体胶点粘。" }
];

// 文创市集产品
const allProducts = [
  // 本地图片来源：src/assets/pictures/2.png；展示图 optimized/2.jpg 为 900x900，页面按 300~500px 宽等比适配。
  {
    id: 1,
    category: "现代家居",
    name: "牡丹花窗·剪纸装饰画",
    price: 128,
    sales: 1200,
    imageUrl: papercutPanelImg,
    imageAlt: "红色牡丹与梅枝剪纸装饰画",
    tag: "热销",
    desc: "以牡丹、梅枝与蝶影构成大幅花窗纹样，适合玄关、客厅或展陈空间陈列，寓意富贵迎春。",
    workshop: "陕州回廓村工坊",
    workers: 12,
    material: "宣纸、艺术框",
    designer: "林晓"
  },
  // 本地图片来源：src/assets/pictures/书签6.png；展示图 optimized/书签6.jpg 为 900x555，页面按 300~500px 宽等比适配。
  {
    id: 2,
    category: "生活周边",
    name: "河洛故事·剪纸书签",
    price: 19.9,
    sales: 850,
    imageUrl: bookmarkImg,
    imageAlt: "红色民俗剪纸书签",
    tag: "新品",
    desc: "把传统戏台、人物与花草纹样压缩进长条书签，适合作为研学纪念和书房小礼。",
    workshop: "灵宝函谷关工坊",
    workers: 8,
    material: "特种纸、覆膜",
    designer: "陈一鸣"
  },
  // 本地图片来源：src/assets/pictures/帆布包1.png；展示图 optimized/帆布包1.jpg 为 900x644，页面按 300~500px 宽等比适配。
  {
    id: 3,
    category: "生活周边",
    name: "仕女踏春·国潮帆布包",
    price: 79,
    sales: 2100,
    imageUrl: toteBagImg,
    imageAlt: "黑白双色国潮剪纸帆布包",
    tag: "热销",
    desc: "以仕女与花枝剪影做大面积印花，黑白双色可选，兼顾通勤收纳与国潮识别度。",
    workshop: "孟津朱仙镇工坊",
    workers: 15,
    material: "加厚棉帆布",
    designer: "王艺"
  },
  // 本地图片来源：src/assets/pictures/明信片4.png；展示图 optimized/明信片4.jpg 为 900x531，页面按 300~500px 宽等比适配。
  {
    id: 4,
    category: "节日礼品",
    name: "百鸟朝凤·剪纸明信片套装",
    price: 29.9,
    sales: 1800,
    imageUrl: postcardImg,
    imageAlt: "百鸟朝凤剪纸明信片",
    tag: "新品",
    desc: "以凤凰、牡丹与回纹边框组合成祝福画面，套装含寄语卡与收藏封套，适合节庆寄送。",
    workshop: "郑州设计研发中心",
    workers: 9,
    material: "艺术卡纸",
    designer: "林晓"
  },
  // 本地图片来源：src/assets/pictures/杯子2.png；展示图 optimized/杯子2.jpg 为 900x582，页面按 300~500px 宽等比适配。
  {
    id: 5,
    category: "生活周边",
    name: "牡丹花枝·陶瓷马克杯",
    price: 49.9,
    sales: 1460,
    imageUrl: mugImg,
    imageAlt: "印有红色牡丹剪纸纹样的陶瓷马克杯",
    tag: "爆款",
    desc: "将牡丹花枝剪纸转印到白瓷杯身，适合办公室、茶水间和非遗展会伴手礼。",
    workshop: "陕州回廓村工坊",
    workers: 10,
    material: "高温白瓷",
    designer: "Team A"
  },
  // 本地图片来源：src/assets/pictures/桌垫3.png；展示图 optimized/桌垫3.jpg 为 900x900，页面按 300~500px 宽等比适配。
  {
    id: 6,
    category: "现代家居",
    name: "团花镂空·节庆桌垫",
    price: 59.9,
    sales: 760,
    imageUrl: tableMatImg,
    imageAlt: "红色团花镂空剪纸桌垫",
    tag: "设计师款",
    desc: "把团花剪纸的层次做成立体镂空桌垫，适合新中式餐桌、茶席和节庆布置。",
    workshop: "陕州回廓村工坊",
    workers: 12,
    material: "环保皮革、棉麻垫层",
    designer: "Team A"
  },
  // 本地图片来源：src/assets/pictures/碗5.png；展示图 optimized/碗5.jpg 为 900x600，页面按 300~500px 宽等比适配。
  {
    id: 7,
    category: "现代家居",
    name: "金羽团花·陶瓷饭碗",
    price: 69,
    sales: 430,
    imageUrl: bowlImg,
    imageAlt: "印有金色团花剪纸纹样的白瓷碗",
    tag: "设计师款",
    desc: "用金色团花与飞鸟纹样装饰白瓷碗面，适合家庭餐具、节日礼盒和文创陈列。",
    workshop: "禹州陶瓷协作工坊",
    workers: 11,
    material: "釉下彩陶瓷",
    designer: "陈一鸣"
  },
  // 网络图片来源：Pexels / Close-up of red paper lanterns with Chinese writing；直链压缩为 500px 宽，页面按 300~500px 宽等比适配。
  {
    id: 8,
    category: "节日礼品",
    name: "福字窗花·新春礼赠套装",
    price: 88,
    sales: 980,
    imageUrl: redLanternGiftImg,
    sourceUrl: redLanternGiftSource,
    sourceNote: "网络来源：Pexels 免费图片 Close-up of red paper lanterns with Chinese writing；直链宽度 500px。",
    imageAlt: "红色福字纸灯笼与新年挂饰",
    tag: "新品",
    desc: "选用福字窗花、门笺和红包封组成节庆礼盒，可用于企业年礼、社区活动和新春布置。",
    workshop: "统一配送中心",
    workers: 20,
    material: "红宣纸、礼盒",
    designer: "教研组"
  },
  // 网络图片来源：Pexels / Hands of a person making red paper decorations；直链压缩为 500px 宽，页面按 300~500px 宽等比适配。
  {
    id: 9,
    category: "节日礼品",
    name: "DIY剪纸体验包(入门级)",
    price: 29.9,
    sales: 5000,
    imageUrl: redPaperDiyImg,
    sourceUrl: redPaperDiySource,
    sourceNote: "网络来源：Pexels 免费图片 Hands of a person making red paper decorations；直链宽度 500px。",
    imageAlt: "手工红纸装饰制作过程",
    tag: "爆款",
    desc: "内含刻刀、红纸、底样和教学视频二维码，适合亲子互动与非遗课堂入门体验。",
    workshop: "统一配送中心",
    workers: 20,
    material: "红纸、刻刀、底样",
    designer: "教研组"
  }
];

// 定制案例
const customCases = [
  { id: 1, title: "某知名车企·年会伴手礼", desc: "将车型轮廓与剪纸纹样结合，定制5000份。", image: "car-gift" },
  { id: 2, title: "景区文创·地标剪纸", desc: "为河南博物院开发的河洛文创系列。", image: "red-tour" },
  { id: 3, title: "婚礼定制·龙凤呈祥", desc: "新人专属姓名嵌入纹样，独一无二的纪念。", image: "wedding" }
];

// --- 组件 ---

// 视频播放模态框
// 视频播放模态框
const VideoModal = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4 animate-fade-in">
      {/* 关闭按钮：改为 Fixed 定位，使用醒目的红色按钮样式 */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[90] flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold shadow-lg transition transform hover:scale-105"
        title="关闭视频"
      >
        <X size={20} />
        <span>关闭</span>
      </button>

      <div className="w-full max-w-5xl bg-black rounded-xl overflow-hidden shadow-2xl relative border border-gray-800">
        <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          {!isPlaying ? (
            // 封面伪装 (Facade): 提升首屏加载速度，避免 Iframe 白屏加载
            <div className="absolute inset-0 w-full h-full cursor-pointer group" onClick={() => setIsPlaying(true)}>
              <img src={videoCover} alt="Video Cover" className="w-full h-full object-cover opacity-60 transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-red-700/90 rounded-full flex items-center justify-center text-white shadow-2xl backdrop-blur-sm transition transform group-hover:scale-110 group-hover:bg-red-600">
                  <Play size={40} className="fill-white ml-2" />
                </div>
              </div>
              <div className="absolute bottom-8 left-8 text-white z-10">
                <span className="bg-red-600/80 px-3 py-1 rounded text-xs font-bold mb-2 inline-block backdrop-blur-md">纪录片</span>
                <h3 className="text-2xl font-bold shadow-sm">中国传统剪纸艺术 · 匠心传承</h3>
                <p className="text-gray-300 text-sm mt-1 flex items-center gap-1"><MousePointerClick size={14} /> 点击立即播放</p>
              </div>
            </div>
          ) : (
            // 真实播放器: 点击后加载，自动播放
            <iframe
              src="//player.bilibili.com/player.html?bvid=BV1Gs41137ta&page=1&high_quality=1&autoplay=1&danmaku=0"
              scrolling="no"
              border="0"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen={true}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

// 商品详情弹窗
const ProductModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative z-10 flex flex-col md:flex-row max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/50 rounded-full hover:bg-white transition z-20">
          <X size={24} />
        </button>

        {/* Image Section: 商品图片均在数据源中标注本地文件名或网络授权来源，详情页按 300~500px 宽等比展示。 */}
        <div className="w-full md:w-1/2 bg-gray-100 relative group flex items-center justify-center p-4 min-h-[320px]">
          <img
            src={product.imageUrl}
            alt={product.imageAlt || product.name}
            data-source-url={product.sourceUrl || product.imageUrl}
            title={product.sourceNote || product.name}
            className="w-full max-w-[500px] h-auto max-h-[70vh] object-contain"
          />
          {/* 溯源标签 */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={14} className="text-red-700" />
              <span className="text-xs font-bold text-gray-800">产地溯源：{product.workshop}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              <User size={10} />
              <span>{product.workers}位村民参与制作</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
          <div className="mb-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">{product.category}</span>
              {product.tag && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold">{product.tag}</span>}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-red-700">¥{formatPrice(product.price)}</span>
              <span className="text-sm text-gray-400 line-through">¥{formatPrice(getOriginalPrice(product.price))}</span>
              <span className="text-sm text-gray-500 ml-auto">{product.sales}人已付款</span>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm flex items-center gap-2">
                  <Info size={14} /> 设计理念
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100">
                  {product.desc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 p-3 rounded-lg">
                  <span className="block text-xs text-gray-500 mb-1">材质工艺</span>
                  <span className="text-sm font-medium text-gray-900">{product.material}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-lg">
                  <span className="block text-xs text-gray-500 mb-1">主设计师</span>
                  <span className="text-sm font-medium text-gray-900">{product.designer}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
            <button className="flex-1 border border-gray-300 rounded-full py-3 font-medium text-gray-700 hover:bg-gray-50 transition active:scale-95">
              联系客服
            </button>
            <button
              onClick={() => { onAddToCart(); onClose(); }}
              className="flex-1 bg-red-700 text-white rounded-full py-3 font-bold hover:bg-red-800 transition shadow-lg shadow-red-700/30 flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingCart size={18} /> 加入购物车
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 趣味互动：每日剪纸挑战
const GameModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative z-10 p-6 text-center">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>

      <div className="mb-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
          <Scissors size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">每日纹样挑战</h3>
        <p className="text-gray-500 text-sm mt-2">完成拼图，解锁今日非遗知识卡片</p>
      </div>

      {/* 模拟拼图区域 */}
      <div className="aspect-square bg-stone-100 rounded-xl mb-6 relative overflow-hidden group cursor-pointer border-2 border-dashed border-red-200">
        <img src="/api/placeholder/400/400?text=Puzzle" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-gray-600 group-hover:text-red-600 group-hover:scale-110 transition">
            <MousePointerClick size={16} className="inline mr-1" /> 点击开始拼图
          </span>
        </div>
      </div>

      <button className="w-full bg-red-700 text-white py-3 rounded-xl font-bold hover:bg-red-800 transition">
        开始挑战 (赢积分)
      </button>
    </div>
  </div>
);

const Navbar = ({ activePage, setActivePage, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: '首页' },
    { id: 'profiles', label: '银青结对' },
    { id: 'ar', label: 'AR 传习馆' },
    { id: 'mall', label: '文创市集' },
    { id: 'custom', label: '定制工坊' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-md border-b border-red-800/10 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => setActivePage('home')}>
            <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center text-white mr-3 shadow-md transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <Scissors size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-wider" style={{ fontFamily: '"Noto Serif SC", serif' }}>剪韵中原</h1>
              <p className="text-xs text-red-800 font-medium tracking-widest">ZHONGYUAN PAPER ART</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${activePage === item.id
                  ? 'text-red-700'
                  : 'text-gray-600 hover:text-red-700'
                  }`}
              >
                {item.label}
                {activePage === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700 transform origin-left animate-expand"></span>
                )}
              </button>
            ))}
            {/* Shopping Cart Icon */}
            <div
              className="relative p-2 text-gray-600 hover:text-red-700 cursor-pointer group transition-transform active:scale-95"
              onClick={() => setActivePage('mall')}
            >
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full animate-pulse-once">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <div
              className="relative p-2 text-gray-600 active:scale-95 transition-transform"
              onClick={() => {
                setActivePage('mall');
                setIsMenuOpen(false);
              }}
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 p-2 active:bg-gray-100 rounded-lg">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg z-50 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-4 text-base font-medium rounded-lg transition-colors active:bg-gray-50 ${activePage === item.id ? 'bg-red-50 text-red-700' : 'text-gray-700'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Page Components ---

const HomePage = ({ setActivePage, setShowVideo, setShowGame }) => {
  return (
    <div className="animate-fade-in relative">
      {/* Hero Section */}
      <div className="relative h-[600px] w-full bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>
          {/* 背景图优化：增加 object-top 以确保人脸显示，移除默认 scale-105 防止过度裁剪 */}
          <img src={homeBg} alt="Cultural Background" className="object-cover object-top w-full h-full opacity-40 transition-transform duration-[20s] hover:scale-110" />
        </div>

        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
          <div className="animate-slide-up">
            <span className="inline-block px-4 py-1 mb-6 border border-red-400/50 rounded-full text-red-300 text-sm tracking-widest backdrop-blur-sm">
              青年设计师 × 银发传承人
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight shadow-sm leading-tight" style={{ fontFamily: '"Noto Serif SC", serif' }}>
              让非遗在<span className="text-red-500 italic">指尖</span>重生
            </h1>
            <p className="max-w-2xl text-lg text-gray-200 mb-8 font-light leading-relaxed mx-auto">
              连接中原大地与现代都市生活。<br />通过AR科技与国潮设计，不仅传承一项技艺，更守护一片乡愁。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={() => setShowVideo(true)} className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-6 py-3 rounded-full transition border border-white/30 backdrop-blur-sm">
                <Play size={18} className="fill-white" /> 观看项目纪录片
              </button>
              <button onClick={() => setActivePage('ar')} className="px-8 py-4 bg-red-700 text-white rounded-full font-medium hover:bg-red-800 transition shadow-lg hover:shadow-red-900/50 flex items-center justify-center group relative overflow-hidden active:scale-95">
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <Smartphone size={20} className="mr-2 group-hover:animate-bounce-small" />
                体验 AR 教学
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Banner */}
      <div className="bg-stone-100 border-b border-stone-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold">NEW</span>
            <span className="text-gray-600">每日剪纸挑战上线啦！完成挑战赢取文创优惠券。</span>
          </div>
          <button onClick={() => setShowGame(true)} className="text-red-700 font-bold hover:underline flex items-center">
            立即挑战 <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Core Features Grid */}
      <div className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>核心板块</h2>
            <div className="w-16 h-1 bg-red-700 mx-auto mb-4"></div>
            <p className="text-gray-500">数字赋能非遗 · 设计点亮乡村</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: 'profiles', icon: Users, color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-700', title: '银青结对共创', desc: '传统技艺与现代创意碰撞。非遗传承人与青年设计师结对，孵化具有市场生命力的非遗新作品。' },
              { id: 'ar', icon: Smartphone, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-700', title: 'AR 互动传习', desc: '看不清？学不会？利用AR技术将平面剪纸3D分解，沉浸式拆解每一刀的技法细节。' },
              { id: 'mall', icon: ShoppingBag, color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-700', title: '国潮文创市集', desc: '实用与美学的结合。家居装饰、节日礼品，让传统剪纸成为现代生活的一部分。' },
              { id: 'custom', icon: User, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-600', title: '设计订单下乡', desc: '连接郑州设计与河南乡村。在线提交定制需求，由乡村工坊制作，非遗助力乡村增收。' }
            ].map((card) => (
              <div key={card.id} className={`bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border-t-4 ${card.border} group cursor-pointer transform hover:-translate-y-1 active:scale-[0.98]`} onClick={() => setActivePage(card.id)}>
                <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <card.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-gray-900 transition-colors">{card.title}</h3>
                <p className="text-gray-500 mb-4 leading-relaxed text-sm">
                  {card.desc}
                </p>
                <span className={`${card.color} font-medium flex items-center text-sm group-hover:translate-x-2 transition-transform`}>
                  立即进入 <ArrowRight size={16} className="ml-1" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Data */}
      <div className="bg-red-900 text-white py-16 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-900 to-red-800 opacity-90 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left relative z-10">
          <div className="mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>我们的足迹</h2>
            <p className="text-red-200">每一刀剪裁，都在书写乡村振兴的新篇章</p>
          </div>
          <div className="flex gap-12 text-center justify-center">
            {[
              { num: '300+', label: '银发传承人' },
              { num: '50+', label: '设计订单' },
              { num: '1.2万', label: '户均增收(元)' }
            ].map((stat, idx) => (
              <div key={idx} className="group">
                <div className="text-3xl md:text-4xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">{stat.num}</div>
                <div className="text-sm text-red-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MallPage = ({ addToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('全部');
  const productCategories = ['全部', ...new Set(allProducts.map((product) => product.category))];

  // 筛选逻辑
  const filteredProducts = activeCategory === '全部'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-stone-50 animate-fade-in pb-20">
      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Banner */}
      <div className="bg-red-900 text-white py-12 px-4 text-center bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] relative">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>国潮文创市集</h2>
          <p className="text-red-100 max-w-xl mx-auto text-sm">将非遗美学融入现代生活。每一件商品，都来自河南乡村工坊，您的购买直接支持乡村振兴。</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Filters */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-2 scrollbar-hide items-center">
          <div className="flex items-center text-gray-500 text-sm mr-2">
            <Filter size={16} className="mr-1" /> 筛选:
          </div>
          {productCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${activeCategory === cat
                ? 'bg-red-700 text-white shadow-lg shadow-red-700/30 scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid: 每张商品图使用数据源中的本地文件或 CC 授权网络图，卡片内按 300~500px 宽等比缩放。 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100 cursor-pointer active:scale-[0.98]"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative h-48 sm:h-64 bg-gray-100 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={product.imageUrl}
                  alt={product.imageAlt || product.name}
                  data-source-url={product.sourceUrl || product.imageUrl}
                  title={product.sourceNote || product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full max-w-[500px] h-auto max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                {product.tag && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">
                    {product.tag}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                  点击查看详情
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] hover:text-red-700 transition-colors">{product.name}</h3>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <span className="text-red-700 font-bold text-lg">¥{formatPrice(product.price)}</span>
                    <span className="text-xs text-gray-400 ml-2">已售{product.sales}+</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart();
                    }}
                    className="bg-gray-900 text-white p-2 rounded-lg hover:bg-red-700 transition-colors active:scale-95 z-20 shadow-md"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            该分类下暂无商品，敬请期待新品上架。
          </div>
        )}
      </div>
    </div>
  );
};

const CustomPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState('shanzhou');
  const [selectedUseCase, setSelectedUseCase] = useState('企业礼品');
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [henanGeoJson, setHenanGeoJson] = useState(null);

  const workshops = [
    {
      id: 'mengjin',
      name: '洛阳·孟津工坊',
      shortName: '孟津',
      status: '待接单',
      statusTone: 'yellow',
      top: '27%',
      left: '27%',
      lng: 112.445,
      lat: 34.825,
      master: '张秀兰',
      specialty: '细纹窗花 / 喜庆团花',
      artisans: 15,
      capacity: 42,
      leadTime: '5-8天',
      bestFor: '婚礼喜品、节庆窗花',
      monthlyIncome: '¥18,200'
    },
    {
      id: 'shanzhou',
      name: '三门峡·陕州工坊',
      shortName: '陕州',
      status: '生产中',
      statusTone: 'red',
      top: '55%',
      left: '43%',
      lng: 111.104,
      lat: 34.72,
      master: '王秀英',
      specialty: '拉手娃娃 / 大型场景',
      artisans: 18,
      capacity: 80,
      leadTime: '7-12天',
      bestFor: '企业伴手礼、展陈装置',
      monthlyIncome: '¥42,600'
    },
    {
      id: 'lingbao',
      name: '灵宝·函谷关工坊',
      shortName: '灵宝',
      status: '生产中',
      statusTone: 'green',
      top: '45%',
      left: '74%',
      lng: 110.894,
      lat: 34.516,
      master: '孟照国',
      specialty: '团花纹样 / 祈福礼盒',
      artisans: 8,
      capacity: 63,
      leadTime: '4-7天',
      bestFor: '文旅纪念、祈福礼品',
      monthlyIncome: '¥25,800'
    },
    {
      id: 'zhuxian',
      name: '开封·朱仙镇工坊',
      shortName: '朱仙镇',
      status: '可接急单',
      statusTone: 'green',
      top: '34%',
      left: '58%',
      lng: 114.348,
      lat: 34.463,
      master: '陈一鸣',
      specialty: '年画剪纸 / 国潮包装',
      artisans: 22,
      capacity: 35,
      leadTime: '3-5天',
      bestFor: '品牌包装、快闪活动',
      monthlyIncome: '¥31,400'
    }
  ];

  const useCases = [
    { title: '企业礼品', desc: '年会、客户答谢、员工福利' },
    { title: '文旅景区', desc: '地标纹样、门票周边、研学套装' },
    { title: '婚礼喜庆', desc: '喜字、龙凤、姓名定制' },
    { title: '校园活动', desc: '社团活动、毕业纪念、非遗课程' }
  ];

  const servicePackages = [
    { id: 'standard', name: '标准定制', price: '¥39起/件', cycle: '3-7天', desc: '适合小批量礼品和基础纹样套用' },
    { id: 'coCreate', name: '共创设计', price: '¥129起/件', cycle: '7-15天', desc: '设计师重绘纹样，传承人审核工艺' },
    { id: 'exhibition', name: '展陈项目', price: '按项目报价', cycle: '15天起', desc: '适合展馆、品牌快闪和大型装置' }
  ];

  const selectedWorkshop = workshops.find((item) => item.id === selectedWorkshopId) || workshops[0];
  const selectedService = servicePackages.find((item) => item.id === selectedPackage) || servicePackages[0];
  const mapBounds = useMemo(() => getGeoJsonBounds(henanGeoJson) || HENAN_MAP_FALLBACK_BOUNDS, [henanGeoJson]);
  const mapProject = useMemo(() => createMapProjector(mapBounds), [mapBounds]);
  const cityMapPaths = useMemo(() => (henanGeoJson?.features || []).map((feature, index) => ({
    id: feature.properties?.adcode || index,
    name: feature.properties?.name || '',
    paths: geometryToPaths(feature.geometry, mapProject)
  })), [henanGeoJson, mapProject]);

  useEffect(() => {
    let cancelled = false;

    fetch(HENAN_GEOJSON_URL)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load Henan GeoJSON');
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setHenanGeoJson(data);
      })
      .catch(() => {
        if (!cancelled) setHenanGeoJson(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API call
  };

  return (
    <div className="min-h-screen bg-stone-50 animate-fade-in">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium mb-5">
                <Briefcase size={16} /> 定制订单下乡
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                让每一份定制需求，精准匹配乡村工坊
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl">
                从使用场景、预算、交付周期到工艺难度，系统会推荐合适的河南剪纸工坊，并展示产能、周期和助农收益。
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl">
                {[
                  { value: '4类', label: '定制场景' },
                  { value: '32家', label: '合作工坊' },
                  { value: '24h', label: '方案响应' }
                ].map((item) => (
                  <div key={item.label} className="border border-gray-100 rounded-lg p-4 bg-stone-50">
                    <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 text-white rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-sm text-gray-400">当前推荐</div>
                  <div className="text-2xl font-bold mt-1">{selectedWorkshop.name}</div>
                </div>
                <span className="bg-red-600 px-3 py-1 rounded-full text-xs">{selectedWorkshop.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="text-gray-400">主理传承人</div>
                  <div className="font-bold mt-1">{selectedWorkshop.master}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="text-gray-400">预计周期</div>
                  <div className="font-bold mt-1">{selectedWorkshop.leadTime}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg col-span-2">
                  <div className="text-gray-400">匹配场景</div>
                  <div className="font-bold mt-1">{selectedWorkshop.bestFor}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-2/3">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  <MapPin className="text-red-700 mr-2" /> 河南乡村工坊网络
                </h3>
                <div className="hidden sm:flex gap-4">
                  <div className="bg-white px-3 py-1 rounded-full shadow-sm text-xs font-medium text-gray-600 flex items-center gap-1 border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> 生产中
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full shadow-sm text-xs font-medium text-gray-600 flex items-center gap-1 border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div> 待接单
                  </div>
                </div>
              </div>

              <div className="relative w-full aspect-[16/11] sm:aspect-[16/9] bg-[#eef4ec] rounded-xl shadow-lg border border-[#cfdcc8] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.85),rgba(221,233,216,0.65)_45%,rgba(198,216,191,0.75))]"></div>
                <div className="absolute inset-0 opacity-35 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <filter id="henanMapShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#334155" floodOpacity="0.18" />
                    </filter>
                    <filter id="mapLabelShadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ffffff" floodOpacity="0.9" />
                    </filter>
                    <linearGradient id="realMapBase" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#edf5e8" />
                      <stop offset="48%" stopColor="#e7efe0" />
                      <stop offset="100%" stopColor="#d8e6d3" />
                    </linearGradient>
                    <pattern id="mapGrid" width="58" height="58" patternUnits="userSpaceOnUse">
                      <path d="M58 0H0V58" fill="none" stroke="#9cae99" strokeWidth="0.6" opacity="0.2" />
                    </pattern>
                  </defs>

                  <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#realMapBase)" />
                  <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#mapGrid)" />

                  {cityMapPaths.length > 0 ? (
                    <g filter="url(#henanMapShadow)">
                      {cityMapPaths.map((city, cityIndex) => (
                        <g key={city.id}>
                          <title>{city.name}</title>
                          {city.paths.map((pathData, pathIndex) => (
                            <path
                              key={`${city.id}-${pathIndex}`}
                              d={pathData}
                              fill={cityFillPalette[cityIndex % cityFillPalette.length]}
                              stroke="#b58b50"
                              strokeWidth="1.15"
                              opacity="0.96"
                            />
                          ))}
                        </g>
                      ))}
                    </g>
                  ) : (
                    <g filter="url(#henanMapShadow)">
                      <path d="M238 108 L322 70 L418 88 L488 64 L572 94 L646 84 L720 132 L760 198 L836 240 L804 318 L844 388 L744 426 L686 498 L604 464 L520 510 L432 468 L348 490 L292 424 L206 398 L232 304 L172 236 Z" fill="#ead49b" stroke="#b88b3d" strokeWidth="3" />
                      <path d="M322 70 C386 172 392 300 348 490" stroke="#8f7449" strokeWidth="2" strokeDasharray="8 8" fill="none" opacity="0.45" />
                      <path d="M172 236 C330 250 530 220 836 240" stroke="#8f7449" strokeWidth="2" strokeDasharray="8 8" fill="none" opacity="0.45" />
                      <path d="M206 398 C366 370 520 392 744 426" stroke="#8f7449" strokeWidth="2" strokeDasharray="8 8" fill="none" opacity="0.45" />
                    </g>
                  )}

                  <g>
                    {henanRiverLines.map((river) => (
                      <g key={river.name}>
                        <path d={lineToPath(river.coords, mapProject)} stroke="#7ec8dd" strokeWidth={river.width} fill="none" opacity="0.72" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={lineToPath(river.coords, mapProject)} stroke="#f8fdff" strokeWidth="2.4" fill="none" opacity="0.82" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    ))}
                  </g>

                  <g opacity="0.68">
                    {henanLogisticsRoutes.map((route, index) => (
                      <path
                        key={index}
                        d={lineToPath(route, mapProject)}
                        stroke={index === 0 ? '#c2410c' : '#b45309'}
                        strokeWidth="2.2"
                        strokeDasharray="8 7"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                    <path
                      d={lineToPath([[selectedWorkshop.lng, selectedWorkshop.lat], [113.62, 34.75]], mapProject)}
                      stroke="#dc2626"
                      strokeWidth="3"
                      strokeDasharray="5 6"
                      fill="none"
                      opacity="0.72"
                      strokeLinecap="round"
                    />
                  </g>

                  <g filter="url(#mapLabelShadow)">
                    <text x={MAP_WIDTH / 2 - 38} y={MAP_HEIGHT / 2 + 18} fill="#6b5b37" fontSize="30" fontWeight="800" opacity="0.22">河南省</text>
                    {henanCityLabels.map((label) => {
                      const point = mapProject(label.lng, label.lat);
                      return (
                        <g key={label.name} className={label.major ? 'hidden sm:block' : 'hidden md:block'}>
                          <circle cx={point.x} cy={point.y - 2} r={label.major ? 3.2 : 2.2} fill="#475569" opacity="0.55" />
                          <text x={point.x + 6} y={point.y + 4} fill="#334155" fontSize={label.major ? 15 : 12} fontWeight={label.major ? 700 : 500} opacity={label.major ? 0.9 : 0.68}>
                            {label.name}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  <g transform="translate(806 472)" className="hidden sm:block">
                    <rect x="0" y="0" width="132" height="42" rx="8" fill="rgba(255,255,255,0.74)" stroke="#d6d3d1" />
                    <path d="M18 24 H92" stroke="#334155" strokeWidth="3" />
                    <path d="M18 18 V30 M92 18 V30" stroke="#334155" strokeWidth="2" />
                    <text x="18" y="15" fill="#475569" fontSize="11">比例尺</text>
                    <text x="98" y="28" fill="#475569" fontSize="12">约100km</text>
                  </g>

                  <g transform="translate(912 54)" className="hidden sm:block">
                    <circle cx="0" cy="0" r="22" fill="rgba(255,255,255,0.72)" stroke="#d6d3d1" />
                    <path d="M0 -15 L6 6 L0 2 L-6 6 Z" fill="#b91c1c" />
                    <text x="-5" y="-24" fill="#475569" fontSize="11" fontWeight="700">N</text>
                  </g>
                </svg>

                <div className="absolute left-5 top-5 bg-white/85 backdrop-blur px-3 py-2 rounded-lg border border-white/70 shadow-sm">
                  <div className="text-xs text-gray-500">{cityMapPaths.length ? '真实行政边界' : '离线示意图层'}</div>
                  <div className="text-sm font-bold text-gray-900">河南工坊分布 GIS</div>
                </div>

                <div className="absolute inset-0">
                  {workshops.map((workshop) => {
                    const selected = selectedWorkshopId === workshop.id;
                    const dotColor = workshop.statusTone === 'yellow' ? 'bg-yellow-500' : workshop.statusTone === 'green' ? 'bg-green-600' : 'bg-red-600';
                    const point = mapProject(workshop.lng, workshop.lat);

                    return (
                      <button
                        key={workshop.id}
                        onClick={() => setSelectedWorkshopId(workshop.id)}
                        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center"
                        style={{ top: `${(point.y / MAP_HEIGHT) * 100}%`, left: `${(point.x / MAP_WIDTH) * 100}%` }}
                        title={workshop.name}
                      >
                        <span className={`mx-auto block rounded-full border-2 border-white shadow-lg transition ${selected ? 'w-8 h-8 bg-red-600 ring-4 ring-red-200 shadow-red-900/30' : `w-4 h-4 ${dotColor} hover:scale-125`}`}></span>
                        <span className={`mt-1 block whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] shadow-sm border ${selected ? 'bg-red-700 text-white border-red-500' : 'bg-white/90 text-gray-700 border-white'}`}>
                          {workshop.shortName}
                        </span>
                      </button>
                    );
                  })}
                </div>

              </div>
              <div className="mt-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5">
                <div className="grid gap-4 md:grid-cols-[1.1fr_1fr_1fr_1.4fr] md:items-center">
                  <div className="flex justify-between gap-3 md:block">
                    <div>
                      <div className="text-xs text-gray-500">选中工坊</div>
                      <div className="font-bold text-gray-900 mt-1">{selectedWorkshop.name}</div>
                    </div>
                    <span className={`h-fit text-[10px] px-2 py-1 rounded md:inline-block md:mt-2 ${selectedWorkshop.statusTone === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {selectedWorkshop.status}
                    </span>
                  </div>
                  <div className="bg-stone-50 rounded-lg p-3 text-xs">
                    <span className="block text-gray-400">特色</span>
                    <span className="block font-medium text-gray-800 mt-1">{selectedWorkshop.specialty}</span>
                  </div>
                  <div className="bg-stone-50 rounded-lg p-3 text-xs">
                    <span className="block text-gray-400">周期</span>
                    <span className="block font-medium text-gray-800 mt-1">{selectedWorkshop.leadTime}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span>产能占用</span>
                        <span>{selectedWorkshop.capacity}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full" style={{ width: `${selectedWorkshop.capacity}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-4 gap-3 mt-5">
                {useCases.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => setSelectedUseCase(item.title)}
                    className={`text-left p-4 rounded-lg border transition ${selectedUseCase === item.title ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white border-gray-100 hover:border-red-100 text-gray-700'}`}
                  >
                    <div className="font-bold text-sm">{item.title}</div>
                    <div className="text-xs mt-1 text-gray-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/3 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-5 flex items-center">
                  <Activity className="text-red-700 mr-2" size={20} /> 工坊匹配详情
                </h4>
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xl font-bold text-gray-900">{selectedWorkshop.shortName}工坊</div>
                      <div className="text-sm text-gray-500 mt-1">传承人：{selectedWorkshop.master}</div>
                    </div>
                    <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs">{selectedUseCase}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">当前产能占用</span>
                      <span className="font-bold text-gray-900">{selectedWorkshop.capacity}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${selectedWorkshop.capacity}%` }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-stone-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">预计周期</div>
                      <div className="font-bold text-gray-900 mt-1">{selectedWorkshop.leadTime}</div>
                    </div>
                    <div className="bg-stone-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">本月增收</div>
                      <div className="font-bold text-red-700 mt-1">{selectedWorkshop.monthlyIncome}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 bg-red-50 border border-red-100 rounded-lg p-3">
                    推荐原因：{selectedWorkshop.specialty}适合{selectedWorkshop.bestFor}，与当前“{selectedUseCase}”场景匹配度高。
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 text-sm">服务套餐</h4>
                <div className="space-y-3">
                  {servicePackages.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedPackage(item.id)}
                      className={`w-full text-left p-4 rounded-lg border transition ${selectedPackage === item.id ? 'border-red-300 bg-red-50' : 'border-gray-100 hover:border-red-100'}`}
                    >
                      <span className="flex justify-between gap-4">
                        <span className="font-bold text-gray-900">{item.name}</span>
                        <span className="text-red-700 text-sm font-bold">{item.price}</span>
                      </span>
                      <span className="block text-xs text-gray-500 mt-1">{item.desc} · {item.cycle}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-14 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                <Award className="text-red-700" /> 定制案例库
              </h3>
              <p className="text-gray-500 text-sm mt-2">按场景沉淀可复用方案，缩短沟通和打样周期。</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp size={16} className="text-red-600" /> 平均复购率 38%
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {customCases.map((item) => (
              <div key={item.id} className="group cursor-pointer border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition bg-white">
                <div className="aspect-[4/3] bg-red-50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 bg-red-600 shadow-xl transform rotate-45 group-hover:rotate-[60deg] transition-transform duration-500"></div>
                    <div className="absolute w-20 h-20 border-4 border-white/70 rounded-full"></div>
                    <Scissors className="absolute text-white/80" size={42} />
                  </div>
                  <div className="absolute left-4 top-4 bg-white/90 px-3 py-1 rounded-full text-xs text-red-700 font-bold">
                    {item.image}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/55 to-transparent text-white">
                    <div className="text-xs opacity-80">已交付案例</div>
                    <div className="font-bold">{item.title}</div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div className="bg-stone-50 rounded-lg p-3">
                      <span className="block text-gray-400">工期</span>
                      <span className="font-bold text-gray-900">7-12天</span>
                    </div>
                    <div className="bg-stone-50 rounded-lg p-3">
                      <span className="block text-gray-400">批量</span>
                      <span className="font-bold text-gray-900">500+</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-16 max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden grid lg:grid-cols-[0.9fr_1.3fr] min-h-[520px]">
          <div className="bg-red-900 p-8 text-white flex flex-col justify-between bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div>
              <h3 className="text-2xl font-bold mb-4">开始定制</h3>
              <p className="text-red-200 text-sm mb-6">当前已生成一份推荐方案，可在提交前继续调整。</p>
              <div className="space-y-3 mb-8">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-xs text-red-200">推荐工坊</div>
                  <div className="font-bold mt-1">{selectedWorkshop.name}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-xs text-red-200">场景</div>
                    <div className="font-bold mt-1">{selectedUseCase}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-xs text-red-200">套餐</div>
                    <div className="font-bold mt-1">{selectedService.name}</div>
                  </div>
                </div>
              </div>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-400" /> 免费设计咨询</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-400" /> 支持小批量起订</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-400" /> 全程可视化品控</li>
              </ul>
            </div>
            <div className="mt-8 text-sm opacity-60">
              剪韵中原定制服务
            </div>
          </div>

          <div className="p-8 relative">
            {!submitted ? (
              <form className="space-y-6 animate-fade-in" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名/称呼</label>
                    <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="怎么称呼您" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                    <input required type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="手机号码" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">定制类型</label>
                  <div className="grid sm:grid-cols-4 gap-3">
                    {useCases.map(type => (
                      <button
                        type="button"
                        key={type.title}
                        onClick={() => setSelectedUseCase(type.title)}
                        className={`text-left rounded-lg border p-3 transition ${selectedUseCase === type.title ? 'bg-red-50 border-red-200 text-red-800' : 'border-gray-200 hover:border-red-100 text-gray-600'}`}
                      >
                        <span className="block text-sm font-bold">{type.title}</span>
                        <span className="block text-xs mt-1 text-gray-500">{type.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">服务套餐</label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {servicePackages.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setSelectedPackage(item.id)}
                        className={`text-left rounded-lg border p-4 transition ${selectedPackage === item.id ? 'bg-red-50 border-red-200' : 'border-gray-200 hover:border-red-100'}`}
                      >
                        <span className="block font-bold text-gray-900">{item.name}</span>
                        <span className="block text-red-700 text-sm mt-1">{item.price}</span>
                        <span className="block text-xs text-gray-500 mt-2">{item.cycle}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">预计数量</label>
                    <input type="number" min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="例如 500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">期望交付时间</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder={selectedWorkshop.leadTime} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">需求描述</label>
                  <textarea required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition h-32" placeholder={`请描述${selectedUseCase}需求，例如纹样、用途、预算、包装形式...`} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">参考图片 (可选)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:border-red-400 hover:text-red-500">
                    <Camera size={24} className="mb-2" />
                    <span className="text-sm">点击上传参考图片</span>
                  </div>
                </div>

                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-red-800 transition shadow-lg transform active:scale-[0.98]">
                  提交需求
                </button>
              </form>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce-small">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">提交成功！</h3>
                <p className="text-gray-500 mb-8 max-w-sm">感谢您的信任。我们的设计顾问将在 24 小时内通过电话与您联系，请保持通讯畅通。</p>
                <button onClick={() => setSubmitted(false)} className="text-red-700 font-medium hover:underline">
                  提交新的需求
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilesPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPair = profilePairs[currentIndex];

  const nextProfile = () => {
    setCurrentIndex((prev) => (prev + 1) % profilePairs.length);
  };

  const prevProfile = () => {
    setCurrentIndex((prev) => (prev - 1 + profilePairs.length) % profilePairs.length);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-red-600 font-bold tracking-widest text-sm uppercase mb-2 block">Project Connect</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            银青结对：<span className="text-red-700">匠心</span>遇上<span className="text-blue-700">创新</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500">
            我们搭建了“青年设计师 + 银发传承人”的结对平台。传统的技法与现代的灵感在这里碰撞，
            共同孵化出具有市场生命力的非遗新作品。
          </p>
        </div>

        {/* Carousel Controls Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={prevProfile}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-12 z-20 p-3 bg-white rounded-full shadow-lg text-gray-600 hover:text-red-700 hover:bg-red-50 transition transform hover:scale-110"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextProfile}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-12 z-20 p-3 bg-white rounded-full shadow-lg text-gray-600 hover:text-red-700 hover:bg-red-50 transition transform hover:scale-110"
          >
            <ChevronRight size={24} />
          </button>

          <div className="space-y-20 transition-all duration-500 animate-fade-in" key={currentPair.id}>
            {/* Pair Display */}
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -z-10"></div>
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-200 rounded-full items-center justify-center text-gray-400 font-serif italic z-10">
                X
              </div>

              <div className="grid md:grid-cols-2 gap-12 md:gap-24">
                {/* Left: Inheritor */}
                <div className="flex flex-col items-end text-right">
                  <div className="relative mb-6 group cursor-pointer">
                    <div className="w-64 h-80 bg-stone-300 rounded-lg overflow-hidden shadow-lg relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                      <img src="/api/placeholder/300/400" alt="Inheritor" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500" />
                      <div className="absolute bottom-4 right-4 text-white font-bold text-xl drop-shadow-md">{currentPair.inheritor.name}</div>
                    </div>
                    <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-red-700/30 rounded-tl-3xl"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">坚守·传统技艺</h3>
                  <p className="text-red-700 font-medium mb-4">{currentPair.inheritor.title} | {currentPair.inheritor.role}</p>
                  <div className="flex gap-2 mb-4 justify-end">
                    {currentPair.inheritor.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-sm">{tag}</span>
                    ))}
                  </div>
                  <p className="text-gray-500 max-w-md leading-relaxed mb-6">
                    “{currentPair.inheritor.desc}”
                  </p>
                  {/* Timeline */}
                  <div className="border-r-2 border-red-100 pr-4 space-y-4">
                    {currentPair.inheritor.timeline.map((item, idx) => (
                      <div key={idx} className="text-xs text-gray-500 relative">
                        <span className="font-bold text-red-800 block">{item.year}</span>
                        {item.event}
                        <div className="absolute -right-[21px] top-1 w-2 h-2 bg-red-400 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Designer */}
                <div className="flex flex-col items-start text-left">
                  <div className="relative mb-6 group cursor-pointer">
                    <div className="w-64 h-80 bg-blue-100 rounded-lg overflow-hidden shadow-lg relative">
                      <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition"></div>
                      <img src="/api/placeholder/300/400" alt="Designer" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500" />
                      <div className="absolute bottom-4 left-4 text-gray-800 font-bold text-xl drop-shadow-sm">{currentPair.designer.name}</div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-blue-700/30 rounded-br-3xl"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">重塑·视觉语言</h3>
                  <p className="text-blue-700 font-medium mb-4">{currentPair.designer.title} | {currentPair.designer.role}</p>
                  <div className="flex gap-2 mb-4">
                    {currentPair.designer.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-sm">{tag}</span>
                    ))}
                  </div>
                  <p className="text-gray-500 max-w-md leading-relaxed mb-6">
                    “{currentPair.designer.desc}”
                  </p>
                  {/* Timeline */}
                  <div className="border-l-2 border-blue-100 pl-4 space-y-4">
                    {currentPair.designer.timeline.map((item, idx) => (
                      <div key={idx} className="text-xs text-gray-500 relative">
                        <span className="font-bold text-blue-800 block">{item.year}</span>
                        {item.event}
                        <div className="absolute -left-[21px] top-1 w-2 h-2 bg-blue-400 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collaborative Outcome */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto flex items-center gap-6 transform hover:-translate-y-1 transition-transform">
          <div className="w-20 h-20 bg-red-50 rounded-lg flex-shrink-0 flex items-center justify-center text-red-700">
            <Gift size={32} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">共创成果：2026《生肖·潮》系列</h4>
            <p className="text-sm text-gray-500 mt-1">
              {currentPair.inheritor.name}老师提供核心剪纸纹样，{currentPair.designer.name}团队进行矢量化重构。
              <span className="text-red-600 font-medium ml-2 bg-red-50 px-2 py-0.5 rounded">销量：5,000+</span>
            </p>
          </div>
          <button className="ml-auto px-5 py-2 border border-gray-200 rounded-full hover:bg-gray-900 hover:text-white transition-colors text-sm font-medium">查看作品</button>
        </div>

        {/* Join CTA */}
        <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">你是设计师？还是民间手艺人？</h3>
            <p className="mb-8 text-gray-300">加入我们的“银青结对”计划，一起创造下一个爆款非遗文创。</p>
            <button className="px-8 py-3 bg-red-600 rounded-full font-bold hover:bg-red-700 transition active:scale-95">申请加入计划</button>
          </div>
          <Scissors className="absolute -bottom-10 -right-10 text-white opacity-5 w-64 h-64 transform -rotate-12" />
        </div>
      </div>
    </div>
  );
};

// Modified ARPage to accept onExit prop
const ARPage = ({ onExit }) => {
  const [showFaq, setShowFaq] = useState(false);
  const [activeCourse, setActiveCourse] = useState('basic');
  const [basicStep, setBasicStep] = useState(0);
  const [basicRotation, setBasicRotation] = useState(0);
  const [basicDragX, setBasicDragX] = useState(null);
  const [advancedStep, setAdvancedStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [fingerPoint, setFingerPoint] = useState({ x: 39, y: 61 });
  const [stepProgress, setStepProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [modelView, setModelView] = useState('front');
  const [toast, setToast] = useState('');

  const advancedSteps = [
    {
      id: 'fold',
      label: '折叠',
      title: '折叠步骤',
      angle: completedSteps.includes('fold') ? 90 : 45,
      help: '按住蓝色操作点沿蓝色轨迹拖动，观察虚拟纸张变形。',
      doneText: '折叠完成：角度已校准到 90°。'
    },
    {
      id: 'cut',
      label: '剪裁',
      title: '剪裁步骤',
      angle: 90,
      help: '按住虚拟剪刀沿蓝色轨迹拖动，绿色路径表示已剪裁。',
      doneText: '剪裁成功：拉手娃娃轮廓已生成。'
    },
    {
      id: 'assemble',
      label: '拼接',
      title: '拼接步骤',
      angle: 90,
      help: '拖动蓝色操作点靠近中心参考点，系统会自动吸附对齐。',
      doneText: '拼接完成：轻轻压实折痕，观察立体效果。'
    }
  ];
  const basicSteps = [
    {
      id: 'fold',
      label: '折叠',
      title: '一折成五瓣',
      help: '沿红色虚线将方纸向中心折叠，形成五折团花的基础角。'
    },
    {
      id: 'cut',
      label: '剪裁',
      title: '剪出花瓣纹样',
      help: '沿黄色虚线剪出花瓣、花蕊和边缘纹样，保留连接点。'
    },
    {
      id: 'open',
      label: '展开',
      title: '展开团花',
      help: '轻轻展开折纸，观察五瓣团花和中心镂空纹样。'
    }
  ];

  const currentAdvancedStep = advancedSteps[advancedStep];
  const isAdvancedCourse = activeCourse === 'advanced';
  const currentStepDone = completedSteps.includes(currentAdvancedStep.id);
  const viewTransforms = {
    front: 'rotateX(0deg) rotateY(0deg)',
    left: 'rotateX(8deg) rotateY(-26deg)',
    right: 'rotateX(8deg) rotateY(26deg)'
  };
  const gestureTracks = {
    fold: {
      start: { x: 39, y: 61 },
      end: { x: 62, y: 36 }
    },
    cut: {
      start: { x: 50, y: 13 },
      end: { x: 50, y: 86 }
    },
    assemble: {
      start: { x: 24, y: 52 },
      end: { x: 50, y: 52 }
    }
  };

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 1800);
  };

  const selectAdvancedCourse = () => {
    setActiveCourse('advanced');
    setAdvancedStep(0);
    setCompletedSteps([]);
    setFingerPoint(gestureTracks.fold.start);
    setStepProgress(0);
    setModelView('front');
    showToast('已进入进阶课程：拉手娃娃');
  };

  const completeCurrentStep = () => {
    setCompletedSteps((prev) => (
      prev.includes(currentAdvancedStep.id) ? prev : [...prev, currentAdvancedStep.id]
    ));
    setFingerPoint(gestureTracks[currentAdvancedStep.id].end);
    setStepProgress(100);
    showToast(currentAdvancedStep.doneText);
  };

  const repeatCurrentStep = () => {
    setCompletedSteps((prev) => prev.filter((item) => item !== currentAdvancedStep.id));
    setFingerPoint(gestureTracks[currentAdvancedStep.id].start);
    setStepProgress(0);
    showToast(`已重置${currentAdvancedStep.label}步骤`);
  };

  const goPrevStep = () => {
    setAdvancedStep((prev) => {
      const next = Math.max(prev - 1, 0);
      const targetStep = advancedSteps[next].id;
      const isDone = completedSteps.includes(targetStep);
      setFingerPoint(isDone ? gestureTracks[targetStep].end : gestureTracks[targetStep].start);
      setStepProgress(isDone ? 100 : 0);
      return next;
    });
  };

  const goNextStep = () => {
    if (!currentStepDone) {
      completeCurrentStep();
      return;
    }
    setAdvancedStep((prev) => {
      const next = Math.min(prev + 1, advancedSteps.length - 1);
      const targetStep = advancedSteps[next].id;
      const isDone = completedSteps.includes(targetStep);
      setFingerPoint(isDone ? gestureTracks[targetStep].end : gestureTracks[targetStep].start);
      setStepProgress(isDone ? 100 : 0);
      return next;
    });
  };

  const getTrackInteraction = (point, track) => {
    const dx = track.end.x - track.start.x;
    const dy = track.end.y - track.start.y;
    const lengthSq = dx * dx + dy * dy;
    const projection = Math.min(1, Math.max(0, ((point.x - track.start.x) * dx + (point.y - track.start.y) * dy) / lengthSq));

    return {
      progress: Math.round(projection * 100),
      point: {
        x: track.start.x + dx * projection,
        y: track.start.y + dy * projection
      }
    };
  };

  const updateGestureFromPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerPoint = {
      x: Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100))
    };
    const interaction = getTrackInteraction(pointerPoint, gestureTracks[currentAdvancedStep.id]);

    setFingerPoint(interaction.point);

    if (!isAdvancedCourse || currentStepDone) return interaction.progress;

    setStepProgress(interaction.progress);

    if (interaction.progress >= 96) {
      completeCurrentStep();
    }

    return interaction.progress;
  };

  const handlePointerMove = (event) => {
    if (!isDragging || !isAdvancedCourse) return;
    updateGestureFromPointer(event);
  };

  const handleBasicPointerMove = (event) => {
    if (isAdvancedCourse || basicDragX === null) return;
    const deltaX = event.clientX - basicDragX;
    setBasicRotation((prev) => prev + deltaX * 0.55);
    setBasicDragX(event.clientX);
  };

  const handleARAction = (event) => {
    if (!isAdvancedCourse) return;
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateGestureFromPointer(event);
  };

  const handleBasicARAction = (event) => {
    if (isAdvancedCourse) return;
    setBasicDragX(event.clientX);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerEnd = (event) => {
    setIsDragging(false);
    setBasicDragX(null);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleShareOrSave = (action) => {
    showToast(action === 'save' ? '成品已保存到演示相册' : '分享卡片已生成');
  };

  const jumpToAdvancedStep = (index) => {
    const targetStep = advancedSteps[index].id;
    const isDone = completedSteps.includes(targetStep);
    setAdvancedStep(index);
    setFingerPoint(isDone ? gestureTracks[targetStep].end : gestureTracks[targetStep].start);
    setStepProgress(isDone ? 100 : 0);
  };

  const renderBasicFoldScene = () => (
    <>
      {/* 基础折叠：用五条红色虚线提示五折团花的折叠方向。 */}
      <div
        className="absolute w-60 h-60 bg-red-600 shadow-2xl transition-transform duration-200"
        style={{
          transform: `rotateX(8deg) rotateY(${basicRotation}deg) rotateZ(45deg) skewY(-10deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10"></div>
        {[0, 1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="absolute left-1/2 top-1/2 h-[120%] border-l-2 border-dashed border-red-100/90 origin-top"
            style={{ transform: `rotate(${item * 36 - 72}deg) translateY(-50%)` }}
          ></div>
        ))}
        <div className="absolute inset-8 border-2 border-dashed border-yellow-300/70 rounded-full"></div>
      </div>
      <div className="absolute top-8 right-8 bg-white/90 text-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        折叠角度：72°
      </div>
    </>
  );

  const renderBasicCutScene = () => (
    <>
      {/* 基础剪裁：黄色虚线标出花瓣和花蕊剪裁路径。 */}
      <div
        className="relative w-64 h-64 transition-transform duration-200"
        style={{
          transform: `rotateX(8deg) rotateY(${basicRotation}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="absolute inset-8 bg-red-600 shadow-2xl" style={{ clipPath: 'polygon(50% 0%, 62% 34%, 100% 38%, 68% 58%, 80% 96%, 50% 72%, 20% 96%, 32% 58%, 0% 38%, 38% 34%)' }}></div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <path d="M50 7 C57 28 72 30 92 37 C75 48 72 61 79 91 C60 73 49 71 21 91 C29 64 26 49 8 37 C31 31 42 27 50 7Z" fill="none" stroke="#FACC15" strokeWidth="2.2" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="11" fill="none" stroke="#FACC15" strokeWidth="2" strokeDasharray="3 3" />
          {[0, 1, 2, 3, 4].map((item) => (
            <circle key={item} cx={50 + Math.cos((item * 72 - 90) * Math.PI / 180) * 24} cy={50 + Math.sin((item * 72 - 90) * Math.PI / 180) * 24} r="4" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
          ))}
        </svg>
      </div>
      <div className="absolute top-8 right-8 bg-white/90 text-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
        <Scissors size={14} className="text-yellow-600" />
        花瓣剪裁路径
      </div>
    </>
  );

  const renderBasicOpenScene = () => (
    <>
      {/* 基础展开：五瓣团花成品，展示中心镂空、花瓣和参考点。 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative w-72 h-72 drop-shadow-2xl transition-transform duration-200"
          style={{
            transform: `rotateX(10deg) rotateY(${basicRotation}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl"></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" aria-label="五折团花成品">
            <defs>
              <radialGradient id="basicFlowerRed" cx="50%" cy="42%" r="65%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="58%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </radialGradient>
              <filter id="basicFlowerShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#000000" floodOpacity="0.35" />
              </filter>
            </defs>
            <g filter="url(#basicFlowerShadow)">
              {[0, 1, 2, 3, 4].map((item) => (
                <path
                  key={item}
                  d="M100 100 C82 76 79 47 100 20 C121 47 118 76 100 100 Z"
                  fill="url(#basicFlowerRed)"
                  transform={`rotate(${item * 72} 100 100)`}
                />
              ))}
              <circle cx="100" cy="100" r="34" fill="#111827" opacity="0.36" />
              <circle cx="100" cy="100" r="22" fill="none" stroke="#fee2e2" strokeWidth="5" opacity="0.9" />
              {[0, 1, 2, 3, 4].map((item) => (
                <circle key={item} cx={100 + Math.cos((item * 72 - 90) * Math.PI / 180) * 55} cy={100 + Math.sin((item * 72 - 90) * Math.PI / 180) * 55} r="9" fill="#111827" opacity="0.24" />
              ))}
              {[0, 1, 2, 3, 4].map((item) => (
                <path
                  key={`line-${item}`}
                  d="M100 112 C112 128 128 132 146 124"
                  fill="none"
                  stroke="#fecaca"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.72"
                  transform={`rotate(${item * 72} 100 100)`}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
      <div className="absolute top-8 right-8 bg-white/90 text-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
        <CheckCircle size={14} className="text-green-600" />
        五瓣团花已展开
      </div>
    </>
  );

  const renderBasicARScene = () => (
    <>
      {basicStep === 0 && renderBasicFoldScene()}
      {basicStep === 1 && renderBasicCutScene()}
      {basicStep === 2 && renderBasicOpenScene()}

      <div className="absolute top-6 left-6 flex flex-wrap gap-2">
        {basicSteps.map((step, index) => (
          <button
            key={step.id}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => setBasicStep(index)}
            className={`px-3 py-1 rounded-full text-xs border transition ${basicStep === index ? 'bg-red-600 text-white border-red-300' : 'bg-gray-900/70 text-gray-300 border-gray-600 hover:bg-gray-800'}`}
          >
            {index + 1}. {step.label}
          </button>
        ))}
      </div>

      <div className="absolute top-16 left-6 flex gap-2">
        <button
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setBasicRotation((prev) => prev - 36)}
          className="px-3 py-1 rounded-full text-xs bg-gray-900/70 text-gray-200 border border-gray-600 hover:bg-gray-800"
        >
          左转
        </button>
        <button
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setBasicRotation(0)}
          className="px-3 py-1 rounded-full text-xs bg-gray-900/70 text-gray-200 border border-gray-600 hover:bg-gray-800"
        >
          复位
        </button>
        <button
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setBasicRotation((prev) => prev + 36)}
          className="px-3 py-1 rounded-full text-xs bg-gray-900/70 text-gray-200 border border-gray-600 hover:bg-gray-800"
        >
          右转
        </button>
      </div>

      <div className="absolute bottom-10 left-10 bg-black/70 backdrop-blur text-white text-xs px-3 py-2 rounded-lg max-w-[240px] border-l-2 border-yellow-400">
        {basicSteps[basicStep].label}：拖动旋转查看
      </div>
    </>
  );

  const renderAdvancedFoldScene = () => (
    <>
      {/* 折叠步骤：红色虚线为折叠线，蓝色参考点模拟手指校准位置。 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={`M${gestureTracks.fold.start.x} ${gestureTracks.fold.start.y} L${gestureTracks.fold.end.x} ${gestureTracks.fold.end.y}`}
          stroke="#60A5FA"
          strokeWidth="0.8"
          strokeDasharray="3 2"
          fill="none"
        />
        <path
          d={`M${gestureTracks.fold.start.x} ${gestureTracks.fold.start.y} L${gestureTracks.fold.end.x} ${gestureTracks.fold.end.y}`}
          stroke="#22C55E"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          pathLength="100"
          style={{ strokeDasharray: 100, strokeDashoffset: 100 - stepProgress }}
        />
        <circle cx={gestureTracks.fold.start.x} cy={gestureTracks.fold.start.y} r="1.2" fill="#60A5FA" />
        <circle cx={gestureTracks.fold.end.x} cy={gestureTracks.fold.end.y} r="1.2" fill="#22C55E" />
      </svg>
      <div
        className="absolute w-64 h-64 bg-red-600 shadow-2xl transition-all duration-300"
        style={{
          transform: `rotate(45deg) skewY(${-6 - stepProgress * 0.16}deg) scale(${1 - stepProgress * 0.0012})`,
          opacity: 0.92
        }}
      >
        <div className="absolute left-1/2 top-0 h-full border-l-4 border-dashed border-red-100 -translate-x-1/2"></div>
        <div className="absolute left-1/2 top-0 h-full border-l-2 border-dashed border-yellow-300 -translate-x-1/2 opacity-60"></div>
        <div className="absolute left-1/2 top-0 w-1 bg-blue-300/80 -translate-x-1/2 transition-all duration-200" style={{ height: `${stepProgress}%` }}></div>
      </div>
      <div className="absolute left-[calc(50%-8rem)] top-1/2 w-24 h-48 bg-red-700/70 blur-[1px] transition-all duration-300"
        style={{ transform: `translateY(-50%) rotate(45deg) skewY(${-10 - stepProgress * 0.2}deg)` }}></div>
      <div className="absolute right-8 bottom-8 w-28 bg-gray-950/70 rounded-lg border border-gray-700 p-2 text-xs">
        <div className="flex justify-between text-gray-300 mb-1">
          <span>折叠进度</span>
          <span>{stepProgress}%</span>
        </div>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${stepProgress}%` }}></div>
        </div>
      </div>
      <div
        className="absolute w-8 h-8 rounded-full bg-blue-500 border-4 border-white shadow-lg shadow-blue-500/40 animate-pulse"
        style={{ left: `${fingerPoint.x}%`, top: `${fingerPoint.y}%`, transform: 'translate(-50%, -50%)' }}
      ></div>
    </>
  );

  const renderAdvancedCutScene = () => (
    <>
      {/* 剪裁步骤：黄色虚线为剪裁路径，虚拟剪刀跟随手指移动。 */}
      <div className="relative w-64 h-72">
        <div className="absolute inset-x-8 top-4 bottom-4 bg-red-600 shadow-2xl" style={{ clipPath: 'polygon(50% 0%, 88% 20%, 78% 58%, 100% 100%, 50% 82%, 0 100%, 22% 58%, 12% 20%)' }}></div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <path d="M50 4 C70 18 70 42 58 58 L78 96 L50 82 L22 96 L42 58 C30 42 30 18 50 4Z" stroke="#FACC15" strokeWidth="2.5" strokeDasharray="5,4" fill="none" />
          <path d="M50 4 C70 18 70 42 58 58 L78 96 L50 82 L22 96 L42 58 C30 42 30 18 50 4Z" stroke="#22C55E" strokeWidth="3" fill="none" strokeLinecap="round" style={{ strokeDasharray: 260, strokeDashoffset: 260 - stepProgress * 2.6 }} />
          <circle cx="50" cy="4" r="3" fill="#38BDF8" />
          <circle cx="42" cy="58" r="2.4" fill="#38BDF8" />
          <circle cx="58" cy="58" r="2.4" fill="#38BDF8" />
        </svg>
      </div>
      <div
        className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-gray-950 shadow-lg shadow-yellow-500/40 transition-transform"
        style={{ left: `${fingerPoint.x}%`, top: `${fingerPoint.y}%`, transform: 'translate(-50%, -50%) rotate(-20deg)' }}
      >
        <Scissors size={24} />
      </div>
      {currentStepDone && (
        <div className="absolute inset-12 rounded-full border-2 border-yellow-300/70 animate-ping"></div>
      )}
      <div className="absolute right-8 bottom-8 w-28 bg-gray-950/70 rounded-lg border border-gray-700 p-2 text-xs">
        <div className="flex justify-between text-gray-300 mb-1">
          <span>剪裁路径</span>
          <span>{stepProgress}%</span>
        </div>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${stepProgress}%` }}></div>
        </div>
      </div>
    </>
  );

  const renderAdvancedAssembleScene = () => {
    const assembleGap = currentStepDone ? 0 : Math.max(0, 46 - stepProgress * 0.46);

    return (
      <>
        {/* 拼接步骤：完成态使用 SVG 剪纸娃娃造型，保留纸张层次和镂空纹样。 */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '900px' }}>
          <div
            className="relative w-[420px] h-[320px] transition-transform duration-500"
            style={{ transform: viewTransforms[modelView], transformStyle: 'preserve-3d' }}
          >
            <div className="absolute left-1/2 top-[74%] w-72 h-12 -translate-x-1/2 rounded-full bg-black/45 blur-md"></div>
            <div className="absolute inset-0 rounded-full bg-red-500/10 blur-3xl opacity-70"></div>

            <svg className="absolute inset-0 w-full h-full drop-shadow-2xl" viewBox="0 0 360 260" aria-label="拉手娃娃剪纸模型">
              <defs>
                <linearGradient id="paperRedLeft" x1="0" x2="1">
                  <stop offset="0%" stopColor="#b91c1c" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <linearGradient id="paperRedRight" x1="0" x2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
                <filter id="paperShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#000000" floodOpacity="0.32" />
                </filter>
              </defs>

              <g transform={`translate(${-assembleGap} 0)`} filter="url(#paperShadow)">
                <path d="M96 30 C86 30 78 36 73 45 C62 45 53 53 53 64 C53 70 56 76 61 79 C59 84 58 90 58 96 C58 109 65 121 76 128 C57 137 45 155 40 180 C52 177 64 174 76 171 L70 226 L91 226 L98 183 L111 226 L132 226 L121 171 C134 174 147 177 159 181 C154 155 140 137 120 128 C131 120 137 108 137 94 C137 88 136 83 134 78 C139 74 142 68 142 62 C142 51 133 43 122 43 C116 35 107 30 96 30 Z" fill="url(#paperRedLeft)" />
                <path d="M130 134 C150 141 169 142 188 136 L191 151 C170 158 147 156 124 145 Z" fill="#dc2626" />
                <circle cx="96" cy="92" r="31" fill="#111827" opacity="0.4" />
                <circle cx="96" cy="92" r="24" fill="none" stroke="#fecaca" strokeWidth="4" opacity="0.84" />
                <circle cx="86" cy="90" r="3" fill="#fecaca" opacity="0.85" />
                <circle cx="106" cy="90" r="3" fill="#fecaca" opacity="0.85" />
                <path d="M88 102 C92 106 100 106 104 102" fill="none" stroke="#fecaca" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                <path d="M67 145 C83 137 109 137 125 145" fill="none" stroke="#fecaca" strokeWidth="5" strokeLinecap="round" opacity="0.78" />
                <path d="M65 166 C85 158 110 158 130 166" fill="none" stroke="#fecaca" strokeWidth="4" strokeLinecap="round" opacity="0.58" />
                <circle cx="70" cy="61" r="9" fill="#7f1d1d" opacity="0.5" />
                <circle cx="124" cy="61" r="9" fill="#7f1d1d" opacity="0.5" />
                <circle cx="96" cy="151" r="6" fill="#111827" opacity="0.22" />
                <circle cx="96" cy="172" r="5" fill="#111827" opacity="0.18" />
              </g>

              <g transform={`translate(${assembleGap} 0) translate(360 0) scale(-1 1)`} filter="url(#paperShadow)">
                <path d="M96 30 C86 30 78 36 73 45 C62 45 53 53 53 64 C53 70 56 76 61 79 C59 84 58 90 58 96 C58 109 65 121 76 128 C57 137 45 155 40 180 C52 177 64 174 76 171 L70 226 L91 226 L98 183 L111 226 L132 226 L121 171 C134 174 147 177 159 181 C154 155 140 137 120 128 C131 120 137 108 137 94 C137 88 136 83 134 78 C139 74 142 68 142 62 C142 51 133 43 122 43 C116 35 107 30 96 30 Z" fill="url(#paperRedRight)" />
                <path d="M130 134 C150 141 169 142 188 136 L191 151 C170 158 147 156 124 145 Z" fill="#fb7185" />
                <circle cx="96" cy="92" r="31" fill="#111827" opacity="0.36" />
                <circle cx="96" cy="92" r="24" fill="none" stroke="#fee2e2" strokeWidth="4" opacity="0.88" />
                <circle cx="86" cy="90" r="3" fill="#fee2e2" opacity="0.88" />
                <circle cx="106" cy="90" r="3" fill="#fee2e2" opacity="0.88" />
                <path d="M88 102 C92 106 100 106 104 102" fill="none" stroke="#fee2e2" strokeWidth="3" strokeLinecap="round" opacity="0.92" />
                <path d="M67 145 C83 137 109 137 125 145" fill="none" stroke="#fee2e2" strokeWidth="5" strokeLinecap="round" opacity="0.78" />
                <path d="M65 166 C85 158 110 158 130 166" fill="none" stroke="#fee2e2" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
                <circle cx="70" cy="61" r="9" fill="#7f1d1d" opacity="0.42" />
                <circle cx="124" cy="61" r="9" fill="#7f1d1d" opacity="0.42" />
                <circle cx="96" cy="151" r="6" fill="#111827" opacity="0.18" />
                <circle cx="96" cy="172" r="5" fill="#111827" opacity="0.16" />
              </g>

              <path
                d="M166 137 C174 132 186 132 194 137 L196 151 C187 158 173 158 164 151 Z"
                fill="#fb7185"
                opacity={Math.max(0.25, stepProgress / 100)}
              />
              <path d="M180 119 C174 130 174 143 180 154 C186 143 186 130 180 119 Z" fill="#111827" opacity="0.25" />
            </svg>

            {currentStepDone && (
              <div className="absolute left-1/2 bottom-2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm text-gray-900 shadow-xl">
                <CheckCircle size={18} className="text-green-600" />
                <span>拉手娃娃已拼接完成</span>
              </div>
            )}
          </div>
        </div>

        {!currentStepDone && (
          <>
            <div className="absolute left-8 bottom-8 w-32 bg-gray-950/70 rounded-lg border border-gray-700 p-2 text-xs">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>对齐吸附</span>
                <span>{stepProgress}%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-300 rounded-full transition-all" style={{ width: `${stepProgress}%` }}></div>
              </div>
            </div>
            <div
              className="absolute w-8 h-8 rounded-full bg-blue-500 border-4 border-white shadow-lg shadow-blue-500/40"
              style={{ left: `${fingerPoint.x}%`, top: `${fingerPoint.y}%`, transform: 'translate(-50%, -50%)' }}
            ></div>
          </>
        )}
      </>
    );
  };

  const renderAdvancedARScene = () => (
    <>
      {currentAdvancedStep.id === 'fold' && renderAdvancedFoldScene()}
      {currentAdvancedStep.id === 'cut' && renderAdvancedCutScene()}
      {currentAdvancedStep.id === 'assemble' && renderAdvancedAssembleScene()}

      {currentAdvancedStep.id !== 'fold' && !(currentAdvancedStep.id === 'assemble' && currentStepDone) && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={`M${gestureTracks[currentAdvancedStep.id].start.x} ${gestureTracks[currentAdvancedStep.id].start.y} L${gestureTracks[currentAdvancedStep.id].end.x} ${gestureTracks[currentAdvancedStep.id].end.y}`}
            stroke="#60A5FA"
            strokeWidth="0.8"
            strokeDasharray="3 2"
            fill="none"
          />
          <path
            d={`M${gestureTracks[currentAdvancedStep.id].start.x} ${gestureTracks[currentAdvancedStep.id].start.y} L${gestureTracks[currentAdvancedStep.id].end.x} ${gestureTracks[currentAdvancedStep.id].end.y}`}
            stroke="#22C55E"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            pathLength="100"
            style={{ strokeDasharray: 100, strokeDashoffset: 100 - stepProgress }}
          />
        </svg>
      )}

      <div className="absolute top-6 left-6 flex flex-wrap gap-2">
        <span className="bg-red-500/20 text-red-100 border border-red-400/40 px-2.5 py-1 rounded-full text-xs">红色虚线：折叠线</span>
        <span className="bg-yellow-500/20 text-yellow-100 border border-yellow-300/40 px-2.5 py-1 rounded-full text-xs">黄色虚线：剪裁线</span>
        <span className="bg-blue-500/20 text-blue-100 border border-blue-300/40 px-2.5 py-1 rounded-full text-xs">蓝色点：参考点</span>
      </div>

      <div className="absolute top-10 right-10 bg-white/90 text-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${currentStepDone ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
        {currentAdvancedStep.id === 'fold' ? `折叠角度：${currentAdvancedStep.angle}°` : `${currentAdvancedStep.label}进度：${stepProgress}%`}
      </div>

      {!currentStepDone && (
        <div className="absolute bottom-10 left-10 bg-black/70 backdrop-blur text-white text-xs px-3 py-2 rounded-lg max-w-[220px] border-l-2 border-yellow-400">
          {currentAdvancedStep.help}
        </div>
      )}

      {currentStepDone && (
        <div className="absolute inset-16 border border-yellow-300/40 rounded-full animate-ping pointer-events-none"></div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white animate-fade-in flex flex-col relative">
      {/* FAQ Overlay */}
      {showFaq && (
        <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center animate-fade-in">
          <div className="bg-gray-800 w-full max-w-2xl h-[70vh] md:h-auto md:max-h-[80vh] rounded-t-2xl md:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <HelpCircle size={20} className="text-red-500" /> 常见问题
              </h3>
              <button onClick={() => setShowFaq(false)} className="p-2 hover:bg-gray-700 rounded-lg transition"><X size={20} /></button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              {faqData.map((item, idx) => (
                <div key={idx} className="bg-gray-700/50 rounded-lg p-4 border border-gray-700">
                  <div className="font-bold text-white mb-2 flex gap-2">
                    <span className="text-red-500">Q:</span> {item.q}
                  </div>
                  <div className="text-gray-300 text-sm leading-relaxed flex gap-2">
                    <span className="text-green-500 font-bold">A:</span> {item.a}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700 bg-gray-900/50 text-center">
              <button onClick={() => setShowFaq(false)} className="w-full bg-red-700 py-3 rounded-lg font-bold hover:bg-red-600 transition">
                返回练习
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] bg-white text-gray-900 px-4 py-2 rounded-full shadow-2xl text-sm animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-800 p-4 shadow-md flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="flex items-center gap-1 text-gray-400 hover:text-white hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-all"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">退出</span>
          </button>

          <div className="h-6 w-px bg-gray-700 hidden md:block"></div>

          <div className="flex items-center gap-2">
            <Smartphone className="text-red-500" />
            <span className="font-bold">AR 剪纸传习馆</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Sidebar Controls */}
        <div className="w-full md:w-80 bg-gray-800/50 p-6 flex flex-col gap-6 border-r border-gray-700 backdrop-blur-md overflow-y-auto">
          <div>
            <h3 className="text-lg font-bold mb-4 text-red-400">选择教程</h3>
            <div className="space-y-3">
              <div
                onClick={() => {
                  setActiveCourse('basic');
                  setStepProgress(0);
                }}
                className={`p-3 rounded-lg cursor-pointer flex flex-col gap-2 group active:bg-red-900/60 transition-all ${!isAdvancedCourse ? 'bg-red-900/40 border border-red-500/50' : 'bg-gray-700/50 hover:bg-gray-700 border border-transparent'}`}
              >
                <div className="flex justify-between items-center w-full">
                  <span>基础：五折团花</span>
                  {!isAdvancedCourse && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-300">进行中</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                <button className="w-full mt-1 bg-red-600 hover:bg-red-500 text-xs py-1.5 rounded text-white font-medium transition flex items-center justify-center gap-1">
                  <Scissors size={12} /> 开始实操
                </button>
              </div>

              <div
                onClick={selectAdvancedCourse}
                className={`p-3 rounded-lg cursor-pointer transition flex flex-col gap-2 group ${isAdvancedCourse ? 'bg-red-900/40 border border-yellow-300/60 shadow-lg shadow-yellow-500/10' : 'bg-gray-700/50 hover:bg-gray-700 border border-transparent'}`}
              >
                <div className="flex justify-between items-center w-full">
                  <span>进阶课程—拉手娃娃</span>
                  <ChevronRight size={16} className={isAdvancedCourse ? 'text-yellow-300' : 'text-gray-500 group-hover:text-white transition-colors'} />
                </div>
                <button className="w-full mt-1 bg-gray-600 hover:bg-red-600 text-xs py-1.5 rounded text-white font-medium transition flex items-center justify-center gap-1">
                  <Scissors size={12} /> 进入练习
                </button>
              </div>

              {['大师：十二生肖', '创意：立体春字'].map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg cursor-pointer transition flex flex-col gap-2 group">
                  <div className="flex justify-between items-center w-full">
                    <span>{item}</span>
                    <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <button className="w-full mt-1 bg-gray-600 hover:bg-red-600 text-xs py-1.5 rounded text-white font-medium transition hidden group-hover:flex items-center justify-center gap-1">
                    <Scissors size={12} /> 进入练习
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-300">AR 辅助功能</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 flex flex-col items-center gap-2 text-sm transition-colors border border-transparent hover:border-gray-500 active:bg-gray-500">
                <span className="w-6 h-6 border-2 border-dashed border-white rounded-md block"></span>
                虚实叠影
              </button>
              <button onClick={() => isAdvancedCourse && completeCurrentStep()} className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 flex flex-col items-center gap-2 text-sm transition-colors border border-transparent hover:border-gray-500 active:bg-gray-500">
                <Play size={20} />
                步骤演示
              </button>
            </div>
          </div>

          {isAdvancedCourse && (
            <div className="space-y-3">
              <div className="flex gap-2">
                {advancedSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => jumpToAdvancedStep(index)}
                    className={`flex-1 h-2 rounded-full transition ${index === advancedStep ? 'bg-yellow-300' : completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-gray-600'}`}
                    title={step.title}
                  ></button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'front', label: '正面' },
                  { id: 'left', label: '左侧' },
                  { id: 'right', label: '右侧' }
                ].map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setModelView(view.id)}
                    className={`rounded-lg py-2 text-xs transition ${modelView === view.id ? 'bg-yellow-300 text-gray-900' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={goPrevStep} className="bg-gray-700 hover:bg-gray-600 rounded-lg py-2 text-xs flex items-center justify-center gap-1">
                  <ChevronLeft size={14} /> 回退
                </button>
                <button onClick={repeatCurrentStep} className="bg-gray-700 hover:bg-gray-600 rounded-lg py-2 text-xs">
                  重复
                </button>
                <button onClick={goNextStep} className="bg-red-600 hover:bg-red-500 rounded-lg py-2 text-xs flex items-center justify-center gap-1">
                  {currentStepDone ? '下一步' : '完成'} <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-auto space-y-4">
            <button
              onClick={() => setShowFaq(true)}
              className="w-full p-4 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 border-dashed rounded-lg text-sm text-gray-300 flex items-center justify-center gap-2 transition"
            >
              <HelpCircle size={16} className="text-yellow-500" />
              遇到困难？我有疑问
            </button>

            <div className="bg-gray-700/30 p-4 rounded-lg text-sm text-gray-400 border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-white">
                  当前步骤 {isAdvancedCourse ? `(${advancedStep + 1}/${advancedSteps.length})` : `(${basicStep + 1}/${basicSteps.length})`}
                </p>
                <span className="text-xs bg-gray-600 px-1.5 py-0.5 rounded">
                  {isAdvancedCourse ? currentAdvancedStep.label : basicSteps[basicStep].label}
                </span>
              </div>
              <p>{isAdvancedCourse ? currentAdvancedStep.help : basicSteps[basicStep].help}</p>
            </div>
          </div>
        </div>

        {/* Main AR Viewport (Simulation) */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          {/* Camera Feed Background Simulation */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 opacity-50"></div>
          <img src="/api/placeholder/1200/800" alt="Camera Feed" className="absolute inset-0 w-full h-full object-cover opacity-20" />

          {/* AR Overlay Elements */}
          <div
            className={`relative w-[300px] h-[300px] md:w-[560px] md:h-[560px] border-2 border-red-500/30 rounded-xl flex items-center justify-center touch-none ${isAdvancedCourse ? isDragging ? 'cursor-grabbing' : 'cursor-grab' : basicDragX === null ? 'cursor-grab' : 'cursor-grabbing'}`}
            onPointerMove={isAdvancedCourse ? handlePointerMove : handleBasicPointerMove}
            onPointerDown={isAdvancedCourse ? handleARAction : handleBasicARAction}
            onPointerUp={handlePointerEnd}
            onPointerLeave={handlePointerEnd}
          >
            {isAdvancedCourse ? renderAdvancedARScene() : renderBasicARScene()}
          </div>

          {/* Camera UI Overlay */}
          <div className="absolute bottom-8 flex gap-8 items-center">
            <div className="text-center">
              <button onClick={() => handleShareOrSave('save')} className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition active:scale-90">
                <Camera size={20} />
              </button>
              <span className="text-[10px] text-gray-400 mt-1 block">保存</span>
            </div>
            <button
              onClick={() => isAdvancedCourse ? completeCurrentStep() : setBasicStep((prev) => (prev + 1) % basicSteps.length)}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent hover:bg-white/10 transition transform active:scale-95"
            >
              <div className={`w-16 h-16 rounded-full ${isAdvancedCourse && currentStepDone ? 'bg-green-400' : 'bg-white'}`}></div>
            </button>
            <div className="text-center">
              <button onClick={() => handleShareOrSave('share')} className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition active:scale-90">
                <Share2 size={20} />
              </button>
              <span className="text-[10px] text-gray-400 mt-1 block">分享</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Entry ---

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [cartCount, setCartCount] = useState(0);
  // Lifting state for Modals to ensure valid Z-Index layering over Navbar
  const [showVideo, setShowVideo] = useState(false);
  const [showGame, setShowGame] = useState(false);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  const renderContent = () => {
    switch (activePage) {
      case 'home': return <HomePage setActivePage={setActivePage} setShowVideo={setShowVideo} setShowGame={setShowGame} />;
      case 'profiles': return <ProfilesPage />;
      case 'ar': return <ARPage onExit={() => setActivePage('home')} />;
      case 'mall': return <MallPage addToCart={addToCart} />;
      case 'custom': return <CustomPage />;
      default: return <HomePage setActivePage={setActivePage} setShowVideo={setShowVideo} setShowGame={setShowGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-900 selection:bg-red-100 selection:text-red-900">
      {activePage !== 'ar' && <Navbar activePage={activePage} setActivePage={setActivePage} cartCount={cartCount} />}

      {renderContent()}

      {/* Footer */}
      {activePage !== 'ar' && (
        <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 text-sm">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center text-white text-xl font-bold mb-6" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                <Scissors size={20} className="mr-2 text-red-600" /> 剪韵中原
              </div>
              <p className="max-w-xs mb-6 leading-relaxed">
                致力于河南剪纸非遗活化与乡村振兴融合创新。<br />
                让古老的技艺在数字化时代焕发新生，让乡村通过非遗产业实现共同富裕。
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 bg-gray-800 rounded-full hover:bg-red-700 transition cursor-pointer"></div>)}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">项目导航</h4>
              <ul className="space-y-3">
                <li><button onClick={() => setActivePage('home')} className="hover:text-white transition-colors">首页概览</button></li>
                <li><button onClick={() => setActivePage('profiles')} className="hover:text-white transition-colors">银青结对</button></li>
                <li><button onClick={() => setActivePage('mall')} className="hover:text-white transition-colors">文创市集</button></li>
                <li><button onClick={() => setActivePage('ar')} className="hover:text-white transition-colors">AR 传习馆</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">联系与支持</h4>
              <ul className="space-y-3">
                <li>商务合作: business@zhongyuan-paper.cn</li>
                <li>加入我们: hr@zhongyuan-paper.cn</li>
                <li>地址: 河南省郑州市高新技术开发区 枫杨街道 莲花街100号河南工业大学</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs">
            <div className="mb-4 md:mb-0">© 2025 剪韵中原项目组 All Rights Reserved.</div>
            <div className="flex gap-6">
              <span>隐私政策</span>
              <span>服务条款</span>
            </div>
          </div>
        </footer>
      )}

      {/* Global Modals */}
      {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}
      {showGame && <GameModal onClose={() => setShowGame(false)} />}
    </div>
  );
};

export default App;
