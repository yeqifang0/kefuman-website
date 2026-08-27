// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', function() {
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initStatsCounter();
    initScrollReveal();
    initBackToTop();
    initCaseFilter();
    initContactForm();
    initModal();
    initNavActive();
});

// ===== 导航栏滚动效果 =====
function initHeaderScroll() {
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // 导航栏背景
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 回到顶部按钮
        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// ===== 移动端菜单 =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if (!menuToggle || !nav) return;
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });
    
    // 点击导航链接后关闭菜单
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });
}

// ===== 平滑滚动 =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            const headerHeight = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ===== 数字计数动画 =====
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;
    
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        let hasComma = target >= 1000;
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            if (hasComma) {
                el.textContent = current.toLocaleString();
            } else {
                el.textContent = current;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    };
    
    // Intersection Observer触发
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

// ===== 滚动显示动画 =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.about-image, .about-text, .advantage-card, .case-card, .brand-card, .process-step, .info-item, .contact-form'
    );
    
    revealElements.forEach(el => el.classList.add('reveal'));
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 加上层级延迟
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
}

// ===== 回到顶部 =====
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== 案例筛选 =====
function initCaseFilter() {
    const tabs = document.querySelectorAll('.case-tab');
    const cards = document.querySelectorAll('.case-card');
    
    if (!tabs.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 更新激活状态
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // 卡片动画过渡
            cards.forEach(card => {
                card.style.transition = 'all 0.4s ease';
                
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        card.style.display = '';
                        // 强制回流
                        void card.offsetWidth;
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 150);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== 联系表单 =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 简单验证
        const name = form.querySelector('input[name="name"]').value.trim();
        const phone = form.querySelector('input[name="phone"]').value.trim();
        
        if (!name) {
            shakeElement(form.querySelector('input[name="name"]'));
            return;
        }
        
        if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
            shakeElement(form.querySelector('input[name="phone"]'));
            return;
        }
        
        // 模拟提交
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '正在提交...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.reset();
            openModal();
        }, 1500);
    });
}

// 表单抖动效果
function shakeElement(el) {
    el.style.transition = 'transform 0.3s ease';
    el.style.borderColor = '#ef4444';
    el.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.1)';
    
    let count = 0;
    const shake = setInterval(() => {
        const direction = count % 2 === 0 ? '-6px' : '6px';
        el.style.transform = `translateX(${direction})`;
        count++;
        if (count >= 4) {
            clearInterval(shake);
            el.style.transform = 'translateX(0)';
            setTimeout(() => {
                el.style.borderColor = '';
                el.style.boxShadow = '';
            }, 500);
        }
    }, 60);
}

// ===== 成功弹窗 =====
function initModal() {
    const closeBtn = document.getElementById('closeModal');
    const modal = document.getElementById('successModal');
    if (!closeBtn || !modal) return;
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
}

function openModal() {
    const modal = document.getElementById('successModal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// ===== 导航激活状态 =====
function initNavActive() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;
    
    const sectionMap = {};
    sections.forEach(section => {
        sectionMap[section.id] = section;
    });
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.pageYOffset + 120;
        
        let currentSection = '';
        
        for (const section of sections) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                currentSection = section.id;
                break;
            }
        }
        
        // 检查是否到底部了
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 100) {
            currentSection = sections[sections.length - 1].id;
        }
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.remove('active');
            if (href === currentSection) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}
