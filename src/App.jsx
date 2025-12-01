import React, { useState, useEffect } from 'react';
import { 
  Play, User, Scissors, ShoppingBag, Smartphone, Menu, X, 
  ArrowRight, Heart, Camera, ChevronRight, Star, Gift, 
  Briefcase, MessageSquare, CheckCircle, ShoppingCart, 
  MapPin, Clock, Truck, HelpCircle, Share2, Info, ChevronLeft,
  Filter, Video, Award, MousePointerClick, TrendingUp, Users, Activity
} from 'lucide-react';

// --- 模拟数据 ---

// 银发传承人 & 青年设计师数据
const profiles = {
  inheritor: {
    name: "李秀芳",
    age: 72,
    title: "国家级非遗传承人",
    role: "安塞剪纸 / 抓髻娃娃",
    desc: "剪纸六十余载，一把剪刀剪出黄土高原的悲欢离合。坚持传统技法，不用画稿，随心而剪。",
    tags: ["安塞剪纸", "国宝级"],
    timeline: [
      { year: "1965", event: "12岁开始随母学习剪纸" },
      { year: "1995", event: "作品《迎亲》被中国美术馆收藏" },
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
      { year: "2024", event: "加入剪韵新生项目，负责纹样矢量化" },
      { year: "2025", event: "主导设计《生肖·潮》系列文创" }
    ]
  }
};

// 文创市集产品
const allProducts = [
  {
    id: 1,
    category: "现代家居",
    name: "“五谷丰登”剪纸镂空台灯",
    price: 159,
    sales: 1200,
    image: "lamp", 
    tag: "热销",
    desc: "将传统《五谷丰登》纹样进行矢量化提取，结合现代金属镂空工艺。灯光透过剪纸纹样投射出斑驳光影，寓意生活富足。",
    workshop: "安塞魏塔村工坊",
    workers: 12,
    material: "黄铜、胡桃木",
    designer: "林晓"
  },
  {
    id: 2,
    category: "节日礼品",
    name: "2026 蛇年大吉·定制伴手礼盒",
    price: 299,
    sales: 850,
    image: "giftbox",
    tag: "新品",
    desc: "专为2026乙巳蛇年设计。内含纯手工剪纸窗花、剪纸纹样丝巾及红包套装。支持企业Logo烫金定制。",
    workshop: "延川文安驿工坊",
    workers: 8,
    material: "宣纸、真丝",
    designer: "陈一鸣"
  },
  {
    id: 3,
    category: "生活周边",
    name: "陕北民俗纹样·棉麻抱枕",
    price: 89,
    sales: 2100,
    image: "pillow",
    tag: "",
    desc: "选取经典的“老鼠娶亲”与“回娘家”场景，通过数码印花技术还原于亲肤棉麻面料之上，让非遗更有温度。",
    workshop: "米脂杨家沟工坊",
    workers: 15,
    material: "天然棉麻",
    designer: "王艺"
  },
  {
    id: 4,
    category: "时尚配饰",
    name: "抓髻娃娃·纯银珐琅吊坠",
    price: 368,
    sales: 450,
    image: "pendant",
    tag: "设计师款",
    desc: "提取抓髻娃娃的核心轮廓，采用古法珐琅填色。既是护身符，也是国潮时尚单品。",
    workshop: "上海设计研发中心",
    workers: 5,
    material: "925银、珐琅",
    designer: "林晓"
  },
  {
    id: 5,
    category: "现代家居",
    name: "团花纹样·艺术挂毯",
    price: 129,
    sales: 300,
    image: "carpet",
    tag: "",
    desc: "大幅团花剪纸的织造化呈现，适合新中式装修风格。",
    workshop: "安塞魏塔村工坊",
    workers: 12,
    material: "棉线混纺",
    designer: "Team A"
  },
  {
    id: 6,
    category: "节日礼品",
    name: "DIY剪纸体验包(入门级)",
    price: 39,
    sales: 5000,
    image: "diy-kit",
    tag: "爆款",
    desc: "内含刻刀、红纸、底样和教学视频二维码，适合亲子互动。",
    workshop: "统一配送中心",
    workers: 20,
    material: "纸类",
    designer: "教研组"
  }
];

// 定制案例
const customCases = [
  { id: 1, title: "某知名车企·年会伴手礼", desc: "将车型轮廓与剪纸纹样结合，定制5000份。", image: "car-gift" },
  { id: 2, title: "景区文创·地标剪纸", desc: "为延安革命纪念馆开发的红色文创系列。", image: "red-tour" },
  { id: 3, title: "婚礼定制·龙凤呈祥", desc: "新人专属姓名嵌入纹样，独一无二的纪念。", image: "wedding" }
];

// --- 组件 ---

// 视频播放模态框
const VideoModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4 animate-fade-in">
    <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-red-500 transition">
      <X size={32} />
    </button>
    <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 flex items-center justify-center">
            {/* 模拟视频播放界面 */}
            <img src="/api/placeholder/1920/1080?text=Video+Player" alt="Video" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Play size={64} className="fill-white opacity-80" />
                <p className="mt-4 text-lg">《剪韵新生》项目纪录片演示</p>
                <p className="text-sm opacity-60">00:00 / 03:45</p>
            </div>
        </div>
        {/* 进度条模拟 */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
            <div className="w-1/3 h-full bg-red-600"></div>
        </div>
    </div>
  </div>
);

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
                
                {/* Image Section */}
                <div className="w-full md:w-1/2 bg-gray-100 relative group">
                     <img src={`/api/placeholder/600/600?text=${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                     {/* 溯源标签 */}
                     <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-gray-100">
                         <div className="flex items-center gap-2 mb-1">
                            <MapPin size={14} className="text-red-700"/> 
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
                            <span className="text-3xl font-bold text-red-700">¥{product.price}</span>
                            <span className="text-sm text-gray-400 line-through">¥{Math.floor(product.price * 1.2)}</span>
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
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
            
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
                        <MousePointerClick size={16} className="inline mr-1"/> 点击开始拼图
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
              <h1 className="text-2xl font-bold text-gray-900 tracking-wider" style={{ fontFamily: '"Noto Serif SC", serif' }}>剪韵新生</h1>
              <p className="text-xs text-red-800 font-medium tracking-widest">PAPER REVIVAL</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  activePage === item.id 
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
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform"/>
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
                className={`block w-full text-left px-4 py-4 text-base font-medium rounded-lg transition-colors active:bg-gray-50 ${
                    activePage === item.id ? 'bg-red-50 text-red-700' : 'text-gray-700'
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

const HomePage = ({ setActivePage }) => {
    const [showVideo, setShowVideo] = useState(false);
    const [showGame, setShowGame] = useState(false);

    return (
      <div className="animate-fade-in relative">
        {/* Modals */}
        {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}
        {showGame && <GameModal onClose={() => setShowGame(false)} />}

        {/* Hero Section */}
        <div className="relative h-[600px] w-full bg-gray-900 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
             <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
             <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>
             <img src="/api/placeholder/1920/1080" alt="Cultural Background" className="object-cover w-full h-full opacity-40 scale-105 transition-transform duration-[20s] hover:scale-110" />
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
                连接陕北黄土高原与现代都市生活。<br/>通过AR科技与国潮设计，不仅传承一项技艺，更守护一片乡愁。
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button onClick={() => setShowVideo(true)} className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-6 py-3 rounded-full transition border border-white/30 backdrop-blur-sm">
                        <Play size={18} className="fill-white"/> 观看项目纪录片
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
                    立即挑战 <ChevronRight size={14}/>
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
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { id: 'ar', icon: Smartphone, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-700', title: 'AR 互动传习', desc: '看不清？学不会？利用AR技术将平面剪纸3D分解，沉浸式拆解每一刀的技法细节。' },
                { id: 'custom', icon: User, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-600', title: '设计订单下乡', desc: '连接上海设计与陕北乡村。在线提交定制需求，由乡村工坊制作，非遗助力乡村增收。' },
                { id: 'mall', icon: ShoppingBag, color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-700', title: '国潮文创市集', desc: '实用与美学的结合。家居装饰、节日礼品，让传统剪纸成为现代生活的一部分。' }
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
                    <p className="text-red-100 max-w-xl mx-auto text-sm">将非遗美学融入现代生活。每一件商品，都来自陕北乡村工坊，您的购买直接支持乡村振兴。</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-8">
                {/* Filters */}
                <div className="flex overflow-x-auto gap-4 mb-8 pb-2 scrollbar-hide items-center">
                    <div className="flex items-center text-gray-500 text-sm mr-2">
                        <Filter size={16} className="mr-1"/> 筛选:
                    </div>
                    {['全部', '现代家居', '节日礼品', '生活周边', '时尚配饰'].map((cat, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                                activeCategory === cat 
                                    ? 'bg-red-700 text-white shadow-lg shadow-red-700/30 scale-105' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div 
                            key={product.id} 
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100 cursor-pointer active:scale-[0.98]"
                            onClick={() => setSelectedProduct(product)}
                        >
                            <div className="relative h-64 bg-gray-100 overflow-hidden">
                                <img src={`/api/placeholder/400/400?text=${product.image}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                                        <span className="text-red-700 font-bold text-lg">¥{product.price}</span>
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Simulate API call
    };

    return (
        <div className="min-h-screen bg-white animate-fade-in">
            {/* Custom Hero */}
            <div className="relative h-80 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <img src="/api/placeholder/1920/600" alt="Workshop" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>设计订单下乡</h2>
                    <p className="text-lg text-gray-200 max-w-2xl">
                        您的每一个定制需求，都将转化为陕北乡村工坊的实实在在的订单。<br/>
                        支持 B2B 企业礼品定制 / C2C 个人专属定制。
                    </p>
                </div>
            </div>

            {/* Map & Process */}
            <div className="py-16 bg-stone-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Interactive Map Visual (Optimized) */}
                        <div className="w-full lg:w-2/3">
                            <div className="flex justify-between items-end mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <MapPin className="text-red-700 mr-2" /> 陕北乡村工坊网络
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
                            
                            <div className="relative w-full aspect-[16/9] bg-[#fdf6e3] rounded-2xl shadow-lg border-2 border-[#e6d7b9] overflow-hidden p-8 group">
                                {/* Simplified Map Background */}
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>
                                <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
                                    <Scissors size={200} />
                                </div>

                                <div className="w-full h-full relative">
                                    {/* Connection Lines (SVG) */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                        {/* Yulin -> Yanan */}
                                        <path d="M30%,30% Q40%,45% 45%,60%" stroke="#d97706" strokeWidth="2" strokeDasharray="6,4" fill="none" className="opacity-40" />
                                        {/* Yanan -> Yanchuan */}
                                        <path d="M45%,60% Q60%,55% 75%,50%" stroke="#d97706" strokeWidth="2" strokeDasharray="6,4" fill="none" className="opacity-40" />
                                    </svg>

                                    {/* Node 1: Yulin Mizhi */}
                                    <div className="absolute top-[25%] left-[25%] group/node cursor-pointer z-10">
                                        <div className="relative">
                                            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                            <div className="absolute -top-1 -left-1 w-6 h-6 border border-yellow-500 rounded-full animate-ping opacity-50"></div>
                                        </div>
                                        <div className="absolute left-6 top-[-10px] bg-white px-4 py-3 rounded-lg shadow-xl text-xs min-w-[160px] border border-stone-100 transform transition-all group-hover/node:scale-105">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-bold text-gray-900 text-sm">榆林·米脂工坊</p>
                                                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">待接单</span>
                                            </div>
                                            <p className="text-gray-500 mb-1">特色：细纹窗花</p>
                                            <div className="flex items-center text-gray-400">
                                                <User size={10} className="mr-1"/> 15位民间艺人
                                            </div>
                                        </div>
                                    </div>

                                    {/* Node 2: Yanan Ansai (Core) */}
                                    <div className="absolute top-[55%] left-[42%] group/node cursor-pointer z-20">
                                        <div className="relative">
                                            <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-md"></div>
                                            <div className="absolute -top-2 -left-2 w-10 h-10 border-2 border-red-500 rounded-full animate-pulse opacity-60"></div>
                                        </div>
                                        <div className="absolute left-10 top-[-30px] bg-white px-4 py-3 rounded-lg shadow-xl text-xs min-w-[180px] border-l-4 border-red-600 transform transition-all group-hover/node:scale-105">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-bold text-gray-900 text-sm">延安·安塞工坊</p>
                                                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>生产中
                                                </span>
                                            </div>
                                            <p className="text-gray-500 mb-1">传承人：<span className="font-bold text-gray-800">李秀芳</span></p>
                                            <p className="text-gray-500 mb-2">特色：抓髻娃娃 / 大型场景</p>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                                                <div className="bg-red-600 h-1.5 rounded-full" style={{width: '80%'}}></div>
                                            </div>
                                            <p className="text-[10px] text-gray-400 text-right">订单饱和度 80%</p>
                                        </div>
                                    </div>

                                    {/* Node 3: Yanchuan Wenanyi */}
                                    <div className="absolute top-[45%] right-[20%] group/node cursor-pointer z-10">
                                        <div className="relative">
                                            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                                            <div className="absolute -top-1 -left-1 w-6 h-6 border border-green-500 rounded-full animate-ping opacity-50"></div>
                                        </div>
                                        <div className="absolute right-6 top-[-10px] bg-white px-4 py-3 rounded-lg shadow-xl text-xs min-w-[160px] border border-stone-100 transform transition-all group-hover/node:scale-105">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-bold text-gray-900 text-sm">延川·文安驿</p>
                                                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">生产中</span>
                                            </div>
                                            <p className="text-gray-500 mb-1">传承人：<span className="font-bold text-gray-800">高金爱</span></p>
                                            <p className="text-gray-500 mb-1">特色：团花纹样</p>
                                            <div className="flex items-center text-gray-400">
                                                <User size={10} className="mr-1"/> 8位在职绣娘
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Real-time Data Panel (New) */}
                        <div className="w-full lg:w-1/3 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                    <Activity className="text-red-700 mr-2" size={20}/> 实时助农数据
                                </h4>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-500">今日新增订单</span>
                                            <span className="font-bold text-gray-900">23 单</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-red-500 h-2 rounded-full w-[45%]"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-500">本月累计增收</span>
                                            <span className="font-bold text-red-700">¥ 128,500</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full w-[72%]"></div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">32</div>
                                            <div className="text-xs text-gray-500">合作工坊</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">500+</div>
                                            <div className="text-xs text-gray-500">带动就业</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Process Steps (Simplified) */}
                            <div className="bg-stone-50 p-6 rounded-xl">
                                <h4 className="font-bold text-gray-900 mb-4 text-sm">定制流程</h4>
                                <div className="space-y-4">
                                    {[
                                        { title: '提交需求', desc: '在线填写意向' },
                                        { title: '设计对接', desc: '设计师出具方案' },
                                        { title: '大师监制', desc: '分配至对应工坊' },
                                        { title: '制作交付', desc: '统一质检发货' }
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white border border-red-200 text-red-700 flex items-center justify-center text-xs font-bold shadow-sm">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{step.title}</p>
                                                <p className="text-xs text-gray-500">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Case Studies */}
            <div className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <h3 className="text-2xl font-bold mb-10 text-center text-gray-900 flex items-center justify-center gap-2">
                        <Award className="text-red-700" /> 成功案例展示
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {customCases.map((item) => (
                            <div key={item.id} className="group cursor-pointer">
                                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                                    <img src={`/api/placeholder/400/300?text=${item.image}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold">查看详情</div>
                                </div>
                                <h4 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="py-20 max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                    <div className="bg-red-900 p-8 text-white md:w-1/3 flex flex-col justify-between bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">开始定制</h3>
                            <p className="text-red-200 text-sm mb-6">您的订单将直接为乡村手艺人带来收益。</p>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-400"/> 免费设计咨询</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-400"/> 支持小批量起订</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-400"/> 全程可视化品控</li>
                            </ul>
                        </div>
                        <div className="mt-8 text-sm opacity-60">
                            © 剪韵新生项目组
                        </div>
                    </div>
                    
                    <div className="p-8 md:w-2/3 relative">
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
                                    <div className="flex gap-4 flex-wrap">
                                        {['企业礼品', '个人收藏', '家居装饰', '其他'].map(type => (
                                            <label key={type} className="flex items-center cursor-pointer">
                                                <input type="radio" name="type" className="mr-2 text-red-600 focus:ring-red-500" />
                                                <span className="text-sm text-gray-600">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">需求描述</label>
                                    <textarea required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition h-32" placeholder="请简要描述您的定制想法，例如：用于婚礼伴手礼，希望有龙凤呈祥图案..." />
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

const ProfilesPage = () => (
  <div className="min-h-screen bg-stone-50 py-12 animate-fade-in">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-red-600 font-bold tracking-widest text-sm uppercase mb-2 block">Project Connect</span>
        <h2 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"Noto Serif SC", serif' }}>
          银青结对：<span className="text-red-700">匠心</span>遇上<span className="text-blue-700">创新</span>
        </h2>
        <p className="max-w-2xl mx-auto text-gray-500">
          我们搭建了“青年设计师 + 银发传承人”的结对平台。传统的技法与现代的灵感在这里碰撞，
          共同孵化出具有市场生命力的非遗新作品。
        </p>
      </div>

      <div className="space-y-20">
        {/* Pair 1 */}
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
                  {/* Placeholder for Inheritor Image: src="/images/inheritor-li.jpg" */}
                  <img src="/api/placeholder/300/400" alt="Inheritor" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500" />
                  <div className="absolute bottom-4 right-4 text-white font-bold text-xl drop-shadow-md">{profiles.inheritor.name}</div>
                </div>
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-red-700/30 rounded-tl-3xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">坚守·传统技艺</h3>
              <p className="text-red-700 font-medium mb-4">{profiles.inheritor.title} | {profiles.inheritor.role}</p>
              <div className="flex gap-2 mb-4 justify-end">
                  {profiles.inheritor.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-sm">{tag}</span>
                  ))}
              </div>
              <p className="text-gray-500 max-w-md leading-relaxed mb-6">
                “{profiles.inheritor.desc}”
              </p>
              {/* Timeline */}
              <div className="border-r-2 border-red-100 pr-4 space-y-4">
                  {profiles.inheritor.timeline.map((item, idx) => (
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
                   {/* Placeholder for Designer Image: src="/images/designer-lin.jpg" */}
                  <img src="/api/placeholder/300/400" alt="Designer" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500" />
                  <div className="absolute bottom-4 left-4 text-gray-800 font-bold text-xl drop-shadow-sm">{profiles.designer.name}</div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-blue-700/30 rounded-br-3xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">重塑·视觉语言</h3>
              <p className="text-blue-700 font-medium mb-4">{profiles.designer.title} | {profiles.designer.role}</p>
              <div className="flex gap-2 mb-4">
                  {profiles.designer.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-sm">{tag}</span>
                  ))}
              </div>
              <p className="text-gray-500 max-w-md leading-relaxed mb-6">
                “{profiles.designer.desc}”
              </p>
              {/* Timeline */}
              <div className="border-l-2 border-blue-100 pl-4 space-y-4">
                  {profiles.designer.timeline.map((item, idx) => (
                      <div key={idx} className="text-xs text-gray-500 relative">
                          <span className="font-bold text-blue-800 block">{item.year}</span>
                          {item.event}
                          <div className="absolute -left-[21px] top-1 w-2 h-2 bg-blue-400 rounded-full"></div>
                      </div>
                  ))}
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
                 李秀芳老师提供核心抓髻娃娃剪纸纹样，林晓团队进行矢量化重构并应用于手机壳、帆布袋。
                 <span className="text-red-600 font-medium ml-2 bg-red-50 px-2 py-0.5 rounded">销量：5,000+</span>
               </p>
             </div>
             <button className="ml-auto px-5 py-2 border border-gray-200 rounded-full hover:bg-gray-900 hover:text-white transition-colors text-sm font-medium">查看作品</button>
          </div>
        </div>
        
        {/* Join CTA */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center text-white relative overflow-hidden">
             <div className="relative z-10">
                 <h3 className="text-2xl font-bold mb-4">你是设计师？还是民间手艺人？</h3>
                 <p className="mb-8 text-gray-300">加入我们的“银青结对”计划，一起创造下一个爆款非遗文创。</p>
                 <button className="px-8 py-3 bg-red-600 rounded-full font-bold hover:bg-red-700 transition active:scale-95">申请加入计划</button>
             </div>
             <Scissors className="absolute -bottom-10 -right-10 text-white opacity-5 w-64 h-64 transform -rotate-12" />
        </div>
      </div>
    </div>
  </div>
);

// Modified ARPage to accept onExit prop
const ARPage = ({ onExit }) => (
  <div className="min-h-screen bg-gray-900 text-white animate-fade-in flex flex-col">
    {/* Header */}
    <div className="bg-gray-800 p-4 shadow-md flex justify-between items-center z-20">
      <div className="flex items-center gap-4">
          {/* New Exit Button */}
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
      <div className="flex items-center gap-4">
          <div className="text-xs bg-red-600 px-2 py-1 rounded animate-pulse">LIVE 演示版</div>
      </div>
    </div>

    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-gray-800/50 p-6 flex flex-col gap-6 border-r border-gray-700 backdrop-blur-md">
        <div>
          <h3 className="text-lg font-bold mb-4 text-red-400">选择教程</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-900/40 border border-red-500/50 rounded-lg cursor-pointer flex justify-between items-center group active:bg-red-900/60">
              <span>基础：五折团花</span>
              <div className="flex items-center gap-2">
                  <span className="text-xs text-red-300">进行中</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            {['进阶：抓髻娃娃', '大师：十二生肖', '创意：立体春字'].map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg cursor-pointer transition flex justify-between items-center group active:bg-gray-600">
                    <span>{item}</span>
                    <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
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
             <button className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 flex flex-col items-center gap-2 text-sm transition-colors border border-transparent hover:border-gray-500 active:bg-gray-500">
               <Play size={20} />
               步骤演示
             </button>
          </div>
        </div>

        <div className="mt-auto">
          <div className="bg-gray-700/30 p-4 rounded-lg text-sm text-gray-400 border border-gray-700">
            <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-white">当前步骤 (2/5)</p>
                <span className="text-xs bg-gray-600 px-1.5 py-0.5 rounded">折叠</span>
            </div>
            <p>沿着红色虚线折叠纸张，注意边角对齐。折叠后请压实折痕。</p>
          </div>
        </div>
      </div>

      {/* Main AR Viewport (Simulation) */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {/* Camera Feed Background Simulation */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 opacity-50"></div>
        {/* 替换为实际AR背景图: src="/images/ar-bg.jpg" */}
        <img src="/api/placeholder/1200/800" alt="Camera Feed" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        
        {/* AR Overlay Elements */}
        <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] border-2 border-red-500/30 rounded-xl flex items-center justify-center">
          {/* Simulated Paper */}
          <div className="w-48 h-48 bg-red-600 opacity-90 transform rotate-45 shadow-2xl relative transition-transform duration-1000 hover:rotate-90">
             <div className="absolute inset-0 border-2 border-dashed border-yellow-300 animate-pulse"></div>
             {/* AR Guidance Line */}
             <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
               <path d="M0,0 L100,100" stroke="yellow" strokeWidth="2" strokeDasharray="5,5" className="animate-dash" />
             </svg>
          </div>

          {/* AR Floating Labels */}
          <div className="absolute top-10 right-10 bg-white/90 text-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1 transform translate-x-4 -translate-y-4 animate-bounce-slow">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            折叠角度：45°
          </div>

          <div className="absolute bottom-10 left-10 bg-black/60 backdrop-blur text-white text-xs px-3 py-2 rounded-lg max-w-[150px] border-l-2 border-yellow-400">
             💡 提示：按住虚线位置，轻轻压实折痕
          </div>
        </div>

        {/* Camera UI Overlay */}
        <div className="absolute bottom-8 flex gap-8 items-center">
            <div className="text-center">
                <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition active:scale-90">
                    <Clock size={20}/>
                </button>
                <span className="text-[10px] text-gray-400 mt-1 block">历史</span>
            </div>
            <button className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent hover:bg-white/10 transition transform active:scale-95">
                <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
             <div className="text-center">
                <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition active:scale-90">
                    <Share2 size={20}/>
                </button>
                <span className="text-[10px] text-gray-400 mt-1 block">分享</span>
            </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App Entry ---

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [cartCount, setCartCount] = useState(0);

  const addToCart = () => {
      setCartCount(prev => prev + 1);
  };

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  const renderContent = () => {
    switch(activePage) {
      case 'home': return <HomePage setActivePage={setActivePage} />;
      case 'profiles': return <ProfilesPage />;
      case 'ar': return <ARPage onExit={() => setActivePage('home')} />;
      case 'mall': return <MallPage addToCart={addToCart} />;
      case 'custom': return <CustomPage />;
      default: return <HomePage setActivePage={setActivePage} />;
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
                <Scissors size={20} className="mr-2 text-red-600" /> 剪韵新生
              </div>
              <p className="max-w-xs mb-6 leading-relaxed">
                致力于陕北剪纸非遗活化与乡村振兴融合创新。<br/>
                让古老的技艺在数字化时代焕发新生，让乡村通过非遗产业实现共同富裕。
              </p>
              <div className="flex gap-4">
                  {/* Social Icons Placeholder */}
                  {[1,2,3].map(i => <div key={i} className="w-8 h-8 bg-gray-800 rounded-full hover:bg-red-700 transition cursor-pointer"></div>)}
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
                <li>商务合作: business@paper-revival.cn</li>
                <li>加入我们: hr@paper-revival.cn</li>
                <li>地址: 陕西省延安市非遗创新产业园 A座</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs">
            <div className="mb-4 md:mb-0">© 2025 剪韵新生项目组 All Rights Reserved.</div>
            <div className="flex gap-6">
                <span>隐私政策</span>
                <span>服务条款</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;