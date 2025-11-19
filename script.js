const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animationFrame;
let lastFrameTime = 0;
let qualityLevel = 1; // 1 = high, 0 = low
const targetFPS = 120;
const frameInterval = 1000 / targetFPS;
const minParticles = 45;
const maxParticles = 150;
let connectionFrameToggle = false;
const pageLoader = document.getElementById("page-loader");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuBackdrop = document.getElementById("menu-backdrop");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (particles.length) {
    initParticles();
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.size = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.6 + 0.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (
      this.x < 0 ||
      this.x > canvas.width ||
      this.y < 0 ||
      this.y > canvas.height
    ) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(92, 108, 247, ${this.alpha})`;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function getParticleCount() {
  const width = canvas.width;
  if (width > 1600) return 140;
  if (width > 1200) return 115;
  if (width > 900) return 90;
  return 65;
}

function initParticles() {
  const count = getParticleCount();
  particles = Array.from({ length: count }, () => new Particle());
}

function connectParticles() {
  if (connectionFrameToggle) return;
  const connectionDistance = qualityLevel === 1 ? 120 : 80;
  const maxConnections = qualityLevel === 1 ? 12 : 8;
  for (let i = 0; i < particles.length; i++) {
    let connections = 0;
    for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = dx * dx + dy * dy;
      if (dist < connectionDistance * connectionDistance) {
        const strength = 1 - Math.sqrt(dist) / connectionDistance;
        ctx.strokeStyle = `rgba(66, 232, 223, ${strength})`;
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        connections++;
      }
    }
  }
  connectionFrameToggle = true;
}

function adjustParticleDensity(avgFrameTime) {
  if (avgFrameTime > frameInterval * 1.25 && particles.length > minParticles) {
    particles.splice(-5);
    qualityLevel = 0;
  } else if (avgFrameTime < frameInterval * 0.9 && particles.length < maxParticles) {
    particles.push(...Array.from({ length: 5 }, () => new Particle()));
    qualityLevel = 1;
  }
}

function animate(timestamp = 0) {
  animationFrame = requestAnimationFrame(animate);
  const delta = timestamp - lastFrameTime;
  if (delta < frameInterval) {
    connectionFrameToggle = false;
    return;
  }
  lastFrameTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  connectParticles();
  adjustParticleDensity(delta);
  connectionFrameToggle = false;
}

initParticles();
animationFrame = requestAnimationFrame(animate);

// Scroll reveal effect
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".glass-card").forEach((card, index) => {
  card.style.opacity = 0;
  card.style.transform = "translateY(40px)";
  card.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${
    index * 0.08
  }s`;
  observer.observe(card);
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".glass-card").forEach((card) => {
    if (card.classList.contains("visible")) return;
    card.addEventListener(
      "transitionend",
      () => {
        card.style.opacity = 1;
        card.style.transform = "none";
      },
      { once: true }
    );
  });
  initLanguageSwitcher();
  initMenuToggle();
});

window.addEventListener("load", () => {
  setTimeout(() => {
    pageLoader?.classList.add("hidden");
  }, 400);
});

const translations = {
  fa: {
    "loader.subtitle": "در حال آماده‌سازی تجربه",
    "loader.title": "لطفاً چند ثانیه صبر کنید...",
    "menu.cta": "برای شروع همکاری پیام بده.",
    "menu.button": "ارسال درخواست",
    "brand.name": "مبین صادقی",
    "brand.role": "توسعه‌دهنده خلاق",
    "nav.home": "خانه",
    "nav.about": "درباره من",
    "nav.skills": "مهارت‌ها",
    "nav.resume": "رزومه",
    "nav.blog": "بلاگ",
    "nav.contact": "تماس",
    "hero.role": "طراح و توسعه‌دهنده وب",
    "hero.greeting": "سلام! من",
    "hero.name": "مبین صادقی",
    "hero.afterName": "هستم",
    "hero.description":
      "تجربه‌ساز دیجیتال با تمرکز بر طراحی رابط کاربری، توسعه فرانت‌اند و خلق تجربه‌های تعاملی سریع و جذاب برای برندهای آینده‌نگر.",
    "hero.ctaPrimary": "مشاهده نمونه‌کار",
    "hero.ctaSecondary": "همکاری جدید",
    "hero.statYears": "سال تجربه",
    "hero.statProjects": "پروژه موفق",
    "hero.statClients": "مشتری راضی",
    "hero.photo": "",
    "hero.floatText": "آماده‌ام رویای دیجیتال شما را به واقعیت تبدیل کنم.",
    "hero.floatSub": "در دسترس برای همکاری",
    "trust.title": "همکاری با برندهای خوش‌نام",
    "trust.badgeTitle": "",
    "trust.badgeNote": "",
    "trust.embedLabel": "نماد اعتماد فعال",
    "trust.desc":
      "پس از دریافت نماد اعتماد الکترونیکی، اسکریپت رسمی را در این بخش قرار دهید تا به صورت زنده نمایش داده شود.",
    "about.title": "درباره من",
    "about.description":
      "من یک توسعه‌دهنده و طراح محصولات دیجیتال هستم که عاشق حل مسئله‌های پیچیده با طراحی کاربر‌ محور و کد تمیز است. با تیم‌های استارتاپی و شرکت‌های بزرگ کار کرده‌ام و از ایده‌پردازی تا لانچ حضوری فعال در پروژه‌ها دارم.",
    "about.list1": "متخصص React، Next.js و انیمیشن‌های تعاملی",
    "about.list2": "تجربه در طراحی سیستم‌های UI و دیزاین‌سیستم",
    "about.list3": "مشاور سئو فنی و بهینه‌سازی عملکرد",
    "timeline.title": "سفر حرفه‌ای",
    "timeline.nowTime": "۱۴۰۲ - اکنون",
    "timeline.nowTitle": "رهبر تیم فرانت‌اند - Nova Studio",
    "timeline.nowDesc": "رهبری تیم فرانت‌اند و توسعه داشبوردهای تعاملی پیچیده",
    "timeline.prevTime": "۱۴۰۰ - ۱۴۰۲",
    "timeline.prevTitle": "مهندس ارشد UI - TechLand",
    "timeline.prevDesc": "طراحی و پیاده‌سازی سیستم طراحی سازمانی",
    "timeline.startTime": "۱۳۹۸ - ۱۴۰۰",
    "timeline.startTitle": "توسعه‌دهنده فریلنس",
    "timeline.startDesc": "همکاری با برندهای مختلف در حوزه وب‌اپ و لندینگ‌پیج",
    "skills.title": "مهارت‌ها و تکنولوژی‌ها",
    "skills.frontendTitle": "فرانت‌اند",
    "skills.frontendDesc": "React, Next.js, Vue, Astro, Vite",
    "skills.uiTitle": "رابط کاربری و موشن",
    "skills.uiDesc": "Framer Motion, GSAP, Three.js, Figma",
    "skills.backendTitle": "بک‌اند",
    "skills.backendDesc": "Node.js, Express, Supabase, Firebase",
    "skills.devopsTitle": "دواپس",
    "skills.devopsDesc": "Vercel, Netlify, Docker, GitHub Actions",
    "portfolio.title": "نمونه‌کارهای برجسته",
    "portfolio.link": "مشاهده همه",
    "portfolio.item1.tag": "وب‌اپ",
    "portfolio.item1.title": "Future Dashboard",
    "portfolio.item1.desc":
      "داشبورد مالی برخط با انیمیشن‌های تعاملی و تم تاریک",
    "portfolio.item2.tag": "لندینگ",
    "portfolio.item2.title": "Nova SaaS",
    "portfolio.item2.desc":
      "لندینگ معرفی محصول SaaS با نرخ تبدیل بالا و تست A/B",
    "portfolio.item3.tag": "محصول",
    "portfolio.item3.title": "Pixel CMS",
    "portfolio.item3.desc":
      "سیستم مدیریت محتوا برای برندهای خلاق با تم چندگانه",
    "resume.title": "رزومه قابل دانلود",
    "resume.download": "دانلود PDF",
    "resume.eduTitle": "تحصیلات",
    "resume.edu1":
      "کارشناسی مهندسی نرم‌افزار - دانشگاه صنعتی (۱۳۹۳-۱۳۹۷)",
    "resume.edu2":
      "دوره تخصصی طراحی تجربه کاربری - دانشگاه هنر برلین",
    "resume.certTitle": "گواهی‌ها",
    "resume.cert1": "گواهی طراحی UX گوگل",
    "resume.cert2": "مدرک Frontend حرفه‌ای متا",
    "blog.title": "آخرین نوشته‌ها",
    "blog.link": "بلاگ",
    "blog.item1.title": "چگونه انیمیشن‌های وب را سبک و سریع نگه داریم؟",
    "blog.item1.desc":
      "راهنمایی برای استفاده از CSS و WebGL بدون کاهش عملکرد و Core Web Vitals.",
    "blog.item1.link": "ادامه →",
    "blog.item2.title": "۵ الگوی UI که در ۲۰۲۵ باید استفاده کنید",
    "blog.item2.desc":
      "روندهای جدید طراحی رابط کاربری که تجربه مینیمال و حرفه‌ای می‌سازند.",
    "blog.item2.link": "ادامه →",
    "blog.item3.title": "مزایای ترکیب Next.js با طراحی اتمیک",
    "blog.item3.desc":
      "تجربه من از ساخت سامانه‌های مدرن با تمرکز روی توسعه سریع و تست‌پذیری.",
    "blog.item3.link": "ادامه →",
    "contact.title": "شروع یک همکاری",
    "contact.desc":
      "برای پروژه‌های جدید و همکاری، فرم زیر را پر کنید یا ایمیل بزنید.",
    "contact.email": "ایمیل: hello@example.com",
    "contact.phone": "تلفن: ۰۹۱۲۱۲۳۴۵۶۷",
    "contact.linkedin": "لینکدین: linkedin.com/in/yourname",
    "contact.form.name": "نام",
    "contact.form.email": "ایمیل",
    "contact.form.message": "پیام",
    "contact.form.namePlaceholder": "نام کامل شما",
    "contact.form.emailPlaceholder": "you@example.com",
    "contact.form.messagePlaceholder": "توضیح پروژه یا سوال",
    "contact.form.submit": "ارسال پیام",
    "footer.copy": "© ۱۴۰۴ نام شما | ساخته شده با عشق و کمی کد",
    "footer.dribbble": "دریبل",
    "footer.behance": "بیهنس",
    "footer.github": "گیت‌هاب",
  },
  en: {
    "loader.subtitle": "Bootstrapping experience",
    "loader.title": "Please hold for a second...",
    "menu.cta": "Ready when you are.",
    "menu.button": "Start a project",
    "brand.name": "Your Name",
    "brand.role": "Creative Developer",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.resume": "Resume",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "hero.role": "Product Designer & Frontend Engineer",
    "hero.greeting": "Hi! I'm",
    "hero.name": "Your Name",
    "hero.afterName": "",
    "hero.description":
      "Digital experience architect focused on UI design, frontend engineering, and lightning-fast interactive products.",
    "hero.ctaPrimary": "View Portfolio",
    "hero.ctaSecondary": "Start a Project",
    "hero.statYears": "Years experience",
    "hero.statProjects": "Shipped projects",
    "hero.statClients": "Happy clients",
    "hero.photo": "Your portrait",
    "hero.floatText": "Ready to turn your product vision into reality.",
    "hero.floatSub": "Open for collaborations",
    "trust.title": "Trusted by bold brands",
    "trust.badgeTitle": "E-Namad",
    "trust.badgeNote": "(Paste the official script here)",
    "trust.embedLabel": "Live trust badge",
    "trust.desc":
      "Once your e-commerce trust seal is issued, paste the official script here to display it live.",
    "about.title": "About me",
    "about.description":
      "I'm a digital product designer & engineer obsessed with solving complex problems through human-centered design and clean code.",
    "about.list1": "Expert in React, Next.js, and immersive animations",
    "about.list2": "UI systems builder with extensive design system work",
    "about.list3": "Technical SEO and performance optimization consultant",
    "timeline.title": "Career journey",
    "timeline.nowTime": "2023 - Present",
    "timeline.nowTitle": "Lead Frontend · Nova Studio",
    "timeline.nowDesc":
      "Leading the frontend guild and building complex interactive dashboards.",
    "timeline.prevTime": "2021 - 2023",
    "timeline.prevTitle": "Senior UI Engineer · TechLand",
    "timeline.prevDesc": "Designed and implemented the enterprise design system.",
    "timeline.startTime": "2019 - 2021",
    "timeline.startTitle": "Freelance Developer",
    "timeline.startDesc":
      "Partnered with diverse brands on web apps and conversion-driven landing pages.",
    "skills.title": "Skills & stacks",
    "skills.frontendTitle": "Frontend",
    "skills.frontendDesc": "React, Next.js, Vue, Astro, Vite",
    "skills.uiTitle": "UI & Motion",
    "skills.uiDesc": "Framer Motion, GSAP, Three.js, Figma",
    "skills.backendTitle": "Backend",
    "skills.backendDesc": "Node.js, Express, Supabase, Firebase",
    "skills.devopsTitle": "DevOps",
    "skills.devopsDesc": "Vercel, Netlify, Docker, GitHub Actions",
    "portfolio.title": "Selected work",
    "portfolio.link": "See all",
    "portfolio.item1.tag": "Web app",
    "portfolio.item1.title": "Future Dashboard",
    "portfolio.item1.desc":
      "Real-time fintech dashboard with cinematic dark motion.",
    "portfolio.item2.tag": "Landing",
    "portfolio.item2.title": "Nova SaaS",
    "portfolio.item2.desc":
      "High-converting SaaS launch page powered by A/B testing.",
    "portfolio.item3.tag": "Product",
    "portfolio.item3.title": "Pixel CMS",
    "portfolio.item3.desc":
      "Creative CMS platform featuring multi-theme support for agencies.",
    "resume.title": "Downloadable resume",
    "resume.download": "Grab the PDF",
    "resume.eduTitle": "Education",
    "resume.edu1":
      "B.Sc. Software Engineering · Tech University (2014-2018)",
    "resume.edu2":
      "Advanced UX Design Program · Berlin University of the Arts",
    "resume.certTitle": "Certifications",
    "resume.cert1": "Google UX Design Certificate",
    "resume.cert2": "Meta Frontend Professional",
    "blog.title": "Latest writings",
    "blog.link": "Blog",
    "blog.item1.title": "Keep web animations smooth & lightweight",
    "blog.item1.desc":
      "A practical guide to mixing CSS & WebGL without hurting Core Web Vitals.",
    "blog.item1.link": "Read more →",
    "blog.item2.title": "5 UI patterns to use in 2025",
    "blog.item2.desc":
      "New interface trends that craft minimalist yet premium experiences.",
    "blog.item2.link": "Read more →",
    "blog.item3.title": "Why Next.js + atomic design works so well",
    "blog.item3.desc":
      "Lessons from building modern platforms with fast delivery & testability.",
    "blog.item3.link": "Read more →",
    "contact.title": "Kick off a collaboration",
    "contact.desc":
      "Share your idea or brief via the form or drop me a direct email.",
    "contact.email": "Email: hello@example.com",
    "contact.phone": "Phone: +98 912 123 4567",
    "contact.linkedin": "LinkedIn: linkedin.com/in/yourname",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.message": "Message",
    "contact.form.namePlaceholder": "Your full name",
    "contact.form.emailPlaceholder": "you@example.com",
    "contact.form.messagePlaceholder": "Project details or question",
    "contact.form.submit": "Send message",
    "footer.copy": "© 2025 Your Name · Crafted with love & code",
    "footer.dribbble": "Dribbble",
    "footer.behance": "Behance",
    "footer.github": "GitHub",
  },
};

let currentLang = "fa";

function applyTranslations(lang) {
  const dict = translations[lang];
  if (!dict) return;
  document.documentElement.lang = lang === "fa" ? "fa" : "en";
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  document.body.classList.toggle("ltr", lang === "en");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    const text = dict[key];
    if (typeof text !== "undefined") {
      el.textContent = text;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (!key) return;
    const text = dict[key];
    if (typeof text !== "undefined") {
      el.setAttribute("placeholder", text);
    }
  });
}

function setActiveLangButton(lang) {
  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function initLanguageSwitcher() {
  const buttons = document.querySelectorAll(".lang-switch button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.lang;
      if (!lang || lang === currentLang) return;
      currentLang = lang;
      applyTranslations(lang);
      setActiveLangButton(lang);
    });
  });

  applyTranslations(currentLang);
  setActiveLangButton(currentLang);
}

function initMenuToggle() {
  if (!menuToggle || !mobileMenu || !menuBackdrop) return;

  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    menuBackdrop.classList.remove("visible");
    menuToggle.classList.remove("active");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    mobileMenu.classList.add("open");
    menuBackdrop.classList.add("visible");
    menuToggle.classList.add("active");
    document.body.classList.add("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    if (mobileMenu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuBackdrop.addEventListener("click", closeMenu);

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}


