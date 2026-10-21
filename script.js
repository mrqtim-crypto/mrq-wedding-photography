/* ==========================================================================
   Mr.Q Photography | 視界攝影 — 主腳本 (v3)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- 1. 載入動畫 Loader ----------
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1200);
    });
    // Fallback 最多 2.5 秒關閉
    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }, 2500);


    // ---------- 2. 導覽列滾動效果 & 活躍標記 ----------
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('header, section');
    const navLinks = document.querySelectorAll('.nav-links a');

    function handleNavbarScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 140;
            if (window.scrollY >= secTop) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();


    // ---------- 3. 手機版漢堡選單 ----------
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


    // ---------- 4. 滾動淡入動畫 (Intersection Observer) ----------
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ---------- 5. Lightbox 大圖彈窗 ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // 點擊無外部 IG 連結的作品，開啟 Lightbox
    document.querySelectorAll('.modal-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const src = trigger.getAttribute('data-src') || trigger.querySelector('img').src;
            const title = trigger.getAttribute('data-title') || '';
            const desc = trigger.getAttribute('data-desc') || '';

            lightboxImg.src = src;
            lightboxImg.alt = title;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }


    // ---------- 6. PX3 榮譽證書專用彈窗 ----------
    const awardModal = document.getElementById('awardModal');
    const openAwardModal = document.getElementById('openAwardModal');
    const closeAwardModal = document.getElementById('closeAwardModal');

    if (openAwardModal && awardModal) {
        openAwardModal.addEventListener('click', () => {
            awardModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeAwardModal.addEventListener('click', () => {
            awardModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        awardModal.addEventListener('click', (e) => {
            if (e.target === awardModal) {
                awardModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 按下 ESC 關閉所有彈窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            if (awardModal) {
                awardModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });


    // ---------- 7. 客戶推薦類別篩選 ----------
    const reviewTabs = document.querySelectorAll('.review-tab');
    const reviewItems = document.querySelectorAll('.review-item');

    reviewTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            reviewTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterType = tab.getAttribute('data-type');

            reviewItems.forEach(item => {
                const itemType = item.getAttribute('data-type');
                if (filterType === 'all' || itemType === filterType) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });


    // ---------- 8. 星星評分互動 ----------
    const starRating = document.getElementById('starRating');
    const stars = starRating ? starRating.querySelectorAll('i') : [];
    let currentRating = 5;

    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const hoverVal = parseInt(star.getAttribute('data-value'));
            updateStarsDisplay(hoverVal);
        });

        star.addEventListener('click', () => {
            currentRating = parseInt(star.getAttribute('data-value'));
            updateStarsDisplay(currentRating);
        });
    });

    if (starRating) {
        starRating.addEventListener('mouseleave', () => {
            updateStarsDisplay(currentRating);
        });
    }

    function updateStarsDisplay(val) {
        stars.forEach(s => {
            const sVal = parseInt(s.getAttribute('data-value'));
            if (sVal <= val) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    }


    // ---------- 9. 提示通知 Toast 函數 ----------
    function showToast(message, icon = 'check-circle') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-${icon}" style="color:var(--gold);"></i> <span>${message}</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3600);
    }


    // ---------- 10. 推薦留言表單送出 ----------
    const reviewForm = document.getElementById('reviewForm');
    const testimonialGrid = document.getElementById('testimonialGrid');

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(reviewForm);
            const name = formData.get('reviewer_name');
            const service = formData.get('reviewer_service');
            const message = formData.get('review_message');

            // 產生星號字串
            let starHtml = '';
            for (let i = 0; i < currentRating; i++) {
                starHtml += '<i class="fas fa-star"></i>';
            }

            // 動態新增評論卡片到最上方
            const newCard = document.createElement('div');
            newCard.className = 'testimonial-card review-item';
            newCard.setAttribute('data-type', 'wedding');
            newCard.innerHTML = `
                <div class="testimonial-stars">${starHtml}</div>
                <p class="testimonial-text">「${escapeHtml(message)}」</p>
                <div class="testimonial-author">
                    <div class="author-avatar"><i class="fas fa-user"></i></div>
                    <div>
                        <span class="author-name">${escapeHtml(name)}</span>
                        <span class="author-service">${escapeHtml(service)}</span>
                    </div>
                </div>
            `;

            testimonialGrid.insertBefore(newCard, testimonialGrid.firstChild);
            showToast('非常感謝您的真實推薦！留言已成功送出 🎉');

            reviewForm.reset();
            currentRating = 5;
            updateStarsDisplay(5);
        });
    }


    // ---------- 11. 預約諮詢表單送出 (直發 ken03101@hotmail.com) ----------
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在傳送需求至信箱...';
            }

            const formData = new FormData(contactForm);

            // 優先以 AJAX 非同步傳送至 FormSubmit.co
            fetch('https://formsubmit.co/ajax/ken03101@hotmail.com', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = origBtnHtml;
                }
                const name = formData.get('name') || '客戶';
                showToast(`🎉 感謝 ${name}！您的預約需求已直達攝影師信箱，我們將火速回覆您。您亦可加 LINE (ken03101) 即時確認！`);
                contactForm.reset();
            })
            .catch(error => {
                // 若 AJAX 遇阻，以原生 POST 提交做穩健備援
                console.warn('AJAX submit fallback to native POST', error);
                contactForm.submit();
            });
        });
    }


    // ---------- 12. 平滑錨點滾動 ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 10;
                const topPos = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: topPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 輔助防 XSS
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});
