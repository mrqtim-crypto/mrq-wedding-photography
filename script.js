/* ========================================
   Mr.Q Photography — 主腳本
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- 載入動畫 ----------
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1800);
    });
    // fallback
    setTimeout(() => loader.classList.add('hidden'), 3000);

    // ---------- 導覽列滾動效果 ----------
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section');

    function onScroll() {
        // 背景變色
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // active link
        const navLinks = document.querySelectorAll('.nav-links a');
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll);
    onScroll();

    // ---------- 漢堡選單 ----------
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---------- Scroll Reveal 動畫 ----------
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- 作品集篩選 ----------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeUp 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ---------- Lightbox ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // 點擊 no-link 作品開啟 lightbox
    document.querySelectorAll('.no-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const img = link.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // ---------- 推薦輪播 ----------
    const track = document.getElementById('testimonialTrack');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = dots.length;

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.index));
        });
    });

    // 自動播放
    setInterval(() => {
        goToSlide((currentSlide + 1) % totalSlides);
    }, 6000);

    // ---------- 星星評分 ----------
    const starRating = document.getElementById('starRating');
    const stars = starRating.querySelectorAll('i');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.value) <= val);
                s.classList.toggle('fas', parseInt(s.dataset.value) <= val);
                s.classList.toggle('far', parseInt(s.dataset.value) > val);
            });
        });

        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
        });
    });

    starRating.addEventListener('mouseleave', () => {
        stars.forEach(s => {
            s.classList.toggle('active', parseInt(s.dataset.value) <= selectedRating);
            s.classList.toggle('fas', parseInt(s.dataset.value) <= selectedRating);
            s.classList.toggle('far', parseInt(s.dataset.value) > selectedRating);
        });
    });

    // ---------- 表單送出 ----------
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // 推薦表單
    document.getElementById('reviewForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (selectedRating === 0) {
            showToast('請先選擇評分星數 ⭐');
            return;
        }
        showToast('感謝您的推薦！🎉');
        e.target.reset();
        selectedRating = 0;
        stars.forEach(s => {
            s.classList.remove('active', 'fas');
            s.classList.add('far');
        });
    });

    // 諮詢表單
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('已收到您的諮詢，我們會盡快回覆！📩');
        e.target.reset();
    });

    // ---------- 平滑錨點滾動 ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
});
