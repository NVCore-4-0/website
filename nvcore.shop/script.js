document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Loader
    const loader = document.getElementById('loader');
    const hideLoader = () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    };

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Reveal Animations
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end + '+';
            }
        };
        window.requestAnimationFrame(step);
    }

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.querySelector('i').setAttribute('data-lucide',
                navLinks.classList.contains('active') ? 'x' : 'menu'
            );
            lucide.createIcons();
        });

        mobileToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mobileToggle.click();
            }
        });

        // Close menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // Magnetic Buttons logic
    const magneticButtons = document.querySelectorAll('.button-magnetic');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
        });
    });

    // Custom Cursor Logic Removed

    // 3D Tilt Effect for Team Cards
    const cards = document.querySelectorAll('.team-member-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;

            // Mouse-follow glow
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
        });
    });

    // Background Parallax logic
    const spheres = document.querySelectorAll('.gradient-sphere');
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;

        spheres.forEach((sphere, index) => {
            const factor = (index + 1) * 30; // Increased factor
            sphere.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });

    // FAQ Accordion logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            faqItems.forEach(other => {
                if (other !== item) other.removeAttribute('open');
            });
        });
    });

    // Script Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categories = document.querySelectorAll('.download-category');
    const indicator = document.querySelector('.filter-indicator');

    function updateIndicator(btn) {
        if (!indicator || !btn) return;
        indicator.style.width = `${btn.offsetWidth}px`;
        indicator.style.left = `${btn.offsetLeft}px`;
    }

    // Initialize indicator
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) {
        setTimeout(() => updateIndicator(activeBtn), 100);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Prevent clicking the same filter
            if (btn.classList.contains('active')) return;

            updateIndicator(btn);

            // Update buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update categories with a smooth transition
            categories.forEach(cat => {
                cat.classList.remove('active');
                cat.style.opacity = '0';
                
                setTimeout(() => {
                    if (cat.getAttribute('data-category') === filter) {
                        cat.style.display = 'block';
                        // Trigger reflow
                        cat.offsetHeight;
                        cat.style.opacity = '1';
                        cat.classList.add('active');
                    } else {
                        cat.style.display = 'none';
                    }
                }, 300); // Wait for fade out
            });

            // Re-trigger reveal animations
            setTimeout(() => {
                const newReveals = document.querySelectorAll(`.download-category[data-category="${filter}"] [data-reveal]`);
                newReveals.forEach(el => {
                    el.classList.remove('active');
                    revealObserver.observe(el);
                });
            }, 350);
        });
    });

    // Handle window resize for indicator
    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.filter-btn.active');
        if (currentActive) updateIndicator(currentActive);
    });

    // Discord Authentication System (Implicit Grant)
    const CLIENT_ID = '1499411271521407026'; // Real Discord Client ID
    const REDIRECT_URI = encodeURIComponent(window.location.origin + '/callback.html');
    
    const getAuthUrls = () => {
        const returnUrl = localStorage.getItem('return_url') || '';
        const state = returnUrl ? encodeURIComponent(returnUrl) : 'none';
        const baseUrl = `client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=identify%20guilds&state=${state}`;
        return {
            auth: `https://discord.com/oauth2/authorize?${baseUrl}`,
            deepLink: `discord://-/oauth2/authorize?${baseUrl}`
        };
    };

    let userSession = JSON.parse(localStorage.getItem('discord_user'));
    let isAuthenticated = userSession ? userSession.authenticated : false;

    const discordModal = document.getElementById('discord-modal');
    const discordLoginBtn = document.getElementById('discord-login-btn');
    const navLoginTrigger = document.getElementById('nav-login-trigger');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');

    const userDropdown = document.getElementById('user-dropdown');
    const dropdownAvatar = document.getElementById('dropdown-avatar');
    const dropdownName = document.getElementById('dropdown-name');
    const logoutTrigger = document.getElementById('logout-trigger');

    const updateUIForAuth = () => {
        if (isAuthenticated && userSession) {
            if (navLoginTrigger) {
                const avatarUrl = userSession.avatar ? `https://cdn.discordapp.com/avatars/${userSession.id}/${userSession.avatar}.png` : 'assets/logo.png';
                navLoginTrigger.innerHTML = `<img src="${avatarUrl}" class="nav-avatar"> ${userSession.username}`;
                navLoginTrigger.classList.add('authenticated');
                
                if (dropdownAvatar) dropdownAvatar.src = avatarUrl;
                if (dropdownName) dropdownName.textContent = userSession.username;
                
                // Show Admin Links if user is staff
                if (userSession.isStaff) {
                    document.querySelectorAll('.admin-link').forEach(el => {
                        el.style.display = el.classList.contains('dropdown-item') ? 'flex' : 'block';
                    });
                }

                lucide.createIcons();
            }
        }
    };
    updateUIForAuth();

    if (isAuthenticated && userSession) {
        const myScriptsTab = document.getElementById('my-scripts-tab');
        if (myScriptsTab) {
            myScriptsTab.style.display = 'flex';
        }

        // Fetch User Scripts from Bot Host
        fetch(`http://ny-us-01.soulixer.in:25432/api/user/scripts/${userSession.id}`)
            .then(res => res.json())
            .then(scripts => {
                const myScriptsGrid = document.getElementById('my-scripts-grid');
                if (myScriptsGrid) {
                    if (!scripts || scripts.length === 0) {
                        myScriptsGrid.innerHTML = `
                            <div style="text-align: center; width: 100%; color: var(--text-muted); padding: 2rem;">
                                You haven't purchased any scripts yet.
                            </div>
                        `;
                    } else {
                        let html = '';
                        scripts.forEach(scriptName => {
                            html += `
                            <div class="project-card glass">
                                <div class="project-img">
                                    <div class="placeholder-img">
                                        <img src="assets/logo.png" alt="NVCore Logo" class="project-card-logo">
                                    </div>
                                </div>
                                <div class="project-content">
                                    <div class="project-header">
                                        <h3 class="project-title">${scriptName}</h3>
                                        <span class="project-price free" style="color: #00ff88;">OWNED</span>
                                    </div>
                                    <p class="project-desc">Verified Purchase. Linked to your Discord Account.</p>
                                    <div class="project-actions">
                                        <a href="documentation.html" class="button btn-detail" style="width: 100%;">
                                            <div class="inner">Documentation</div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            `;
                        });
                        myScriptsGrid.innerHTML = html;
                    }
                }
            })
            .catch(err => {
                console.error('Error fetching scripts:', err);
                const myScriptsGrid = document.getElementById('my-scripts-grid');
                if (myScriptsGrid) {
                    myScriptsGrid.innerHTML = `
                        <div style="text-align: center; width: 100%; color: var(--text-muted); padding: 2rem;">
                            Failed to load your scripts. Backend offline.
                        </div>
                    `;
                }
            });
    }

    const showModal = () => {
        localStorage.removeItem('return_url');
        if (discordModal) discordModal.classList.add('active');
    };
    
    const hideModal = () => {
        if (discordModal) discordModal.classList.remove('active');
    };

    if (modalClose) modalClose.addEventListener('click', hideModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', hideModal);

    if (discordLoginBtn) {
        discordLoginBtn.addEventListener('click', () => {
            // Redirect to real Discord OAuth
            if (CLIENT_ID === 'YOUR_DISCORD_CLIENT_ID') {
                // FALLBACK: Simulation mode if no ID provided
                const inner = discordLoginBtn.querySelector('.inner');
                inner.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Simulating...';
                lucide.createIcons();
                setTimeout(() => {
                    isAuthenticated = true;
                    localStorage.setItem('discord_user', JSON.stringify({username: 'DemoUser', authenticated: true}));
                    location.reload();
                }, 1500);
            } else {
                // Try to open the Discord app directly (Deep Link)
                const { auth, deepLink } = getAuthUrls();
                window.location.href = deepLink;
                
                // Fallback to web after a short delay in case the app isn't installed
                setTimeout(() => {
                    if (document.hasFocus()) {
                        window.location.href = auth;
                    }
                }, 500);

            }
        });
    }

    if (navLoginTrigger) {
        navLoginTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isAuthenticated) {
                showModal();
            } else {
                if (userDropdown) userDropdown.classList.toggle('active');
            }
        });
    }

    if (logoutTrigger) {
        logoutTrigger.addEventListener('click', () => {
            localStorage.removeItem('discord_user');
            location.reload();
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (userDropdown && !e.target.closest('.nav-user-container')) {
            userDropdown.classList.remove('active');
        }
    });

    const storeAuthModal = document.getElementById('store-auth-modal');
    const storeModalClose = document.getElementById('store-modal-close');
    const storeLoginBtns = document.querySelectorAll('.store-login-btn');

    const showStoreModal = () => {
        if (storeAuthModal) storeAuthModal.classList.add('active');
    };

    const hideStoreModal = () => {
        if (storeAuthModal) storeAuthModal.classList.remove('active');
    };

    if (storeModalClose) storeModalClose.addEventListener('click', hideStoreModal);
    
    storeLoginBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const { auth, deepLink } = getAuthUrls();
            window.location.href = deepLink;
            setTimeout(() => {
                if (document.hasFocus()) {
                    window.location.href = auth;
                }
            }, 500);
        });
    });

    // Gatekeeper for Store Links
    const storeLinks = document.querySelectorAll('.project-card .button, .buy-btn, .doc-badge.store-link');
    storeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!isAuthenticated) {
                e.preventDefault();
                const targetUrl = link.getAttribute('href');
                if (targetUrl && targetUrl !== '#' && !targetUrl.startsWith('javascript:')) {
                    localStorage.setItem('return_url', targetUrl);
                }
                showStoreModal();
            }
        });
    });

    // Product Detail Redirect Logic
    const detailButtons = document.querySelectorAll('.detail-btn');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'documentation-2.html';
        });
    });

    // Real Discord Stats Logic
    const fetchDiscordStats = async () => {
        try {
            // Using the invite API gives us approximate_member_count which is more accurate for total members
            const response = await fetch('https://discord.com/api/v9/invites/Cr6zAJD2vV?with_counts=true');
            const data = await response.json();
            
            if (data && data.approximate_member_count) {
                if (document.getElementById('discord-members')) {
                    document.getElementById('discord-members').textContent = data.approximate_member_count.toLocaleString() + '+';
                }
                if (document.getElementById('discord-online')) {
                    document.getElementById('discord-online').textContent = (data.approximate_presence_count || 0).toLocaleString() + '+';
                }
                
                // Also update the section title if needed
                const sectionTitle = document.querySelector('.discord-info .section-title span');
                if (sectionTitle) {
                    sectionTitle.textContent = data.approximate_member_count.toLocaleString() + '+';
                }

                // Update the custom Discord card
                if (document.getElementById('card-online-count')) {
                    document.getElementById('card-online-count').textContent = (data.approximate_presence_count || 0).toLocaleString();
                }
                if (document.getElementById('card-member-count')) {
                    document.getElementById('card-member-count').textContent = (data.approximate_member_count || 0).toLocaleString() + ' Members';
                }
            }
        } catch (error) {
            console.error('Failed to fetch Discord stats:', error);
            // Fallback to static numbers if API fails
            if (document.getElementById('discord-members')) document.getElementById('discord-members').textContent = '1,200+';
            if (document.getElementById('discord-online')) document.getElementById('discord-online').textContent = '150+';
            if (document.getElementById('card-online-count')) document.getElementById('card-online-count').textContent = '150';
            if (document.getElementById('card-member-count')) document.getElementById('card-member-count').textContent = '1,200 Members';
        }
    };

    fetchDiscordStats();

    // Cosmic Background: Starfield Generation (fills the viewport, static — no scroll motion)
    const generateStars = (container, count, sizeRange, opacityRange) => {
        if (!container) return;
        let stars = '';
        for (let i = 0; i < count; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = (sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])).toFixed(2);
            const opacity = (opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0])).toFixed(2);
            const delay = (Math.random() * 6).toFixed(2);
            const duration = (4 + Math.random() * 5).toFixed(2);
            stars += `<span class="star" style="left:${x}%; top:${y}%; width:${size}px; height:${size}px; --max-opacity:${opacity}; animation-delay:${delay}s; animation-duration:${duration}s;"></span>`;
        }
        container.innerHTML = stars;
    };

    generateStars(document.getElementById('stars-deep'), 90, [0.4, 0.8], [0.08, 0.25]);
    generateStars(document.getElementById('stars-far'), 70, [0.7, 1.4], [0.15, 0.45]);
    generateStars(document.getElementById('stars-near'), 35, [1.3, 2.4], [0.35, 0.85]);

    // Galaxy band: dense star cluster concentrated along the strip
    const galaxyStarsEl = document.getElementById('galaxy-stars');
    if (galaxyStarsEl) {
        let stars = '';
        for (let i = 0; i < 130; i++) {
            const x = Math.random() * 100;
            // Gaussian-ish clustering toward vertical center for a dense band look
            const y = 50 + (Math.random() + Math.random() + Math.random() - 1.5) * 30;
            const size = (Math.random() < 0.1 ? 1.8 : 1) * (0.6 + Math.random() * 0.8);
            const opacity = (0.3 + Math.random() * 0.6).toFixed(2);
            const delay = (Math.random() * 6).toFixed(2);
            const duration = (3 + Math.random() * 5).toFixed(2);
            stars += `<span class="star" style="left:${x}%; top:${y}%; width:${size.toFixed(2)}px; height:${size.toFixed(2)}px; --max-opacity:${opacity}; animation-delay:${delay}s; animation-duration:${duration}s;"></span>`;
        }
        galaxyStarsEl.innerHTML = stars;
    }

    // Hero: mouse-reactive floating text + zero-gravity drag
    const heroSection = document.getElementById('home');
    const heroContent = document.getElementById('hero-content');

    if (heroSection && heroContent) {
        let tiltX = 0, tiltY = 0; // parallax offset from cursor hover (not dragging)
        let dragX = 0, dragY = 0; // persistent offset from dragging/drifting
        let isDragging = false;
        let dragStartX = 0, dragStartY = 0;
        let dragOriginX = 0, dragOriginY = 0;
        let velX = 0, velY = 0;
        let lastPointerX = 0, lastPointerY = 0;
        let lastPointerTime = 0;
        let driftFrame = null;

        const applyTransform = () => {
            heroContent.style.transform = `translate(${tiltX + dragX}px, ${tiltY + dragY}px)`;
        };

        const stopDrift = () => {
            if (driftFrame) cancelAnimationFrame(driftFrame);
            driftFrame = null;
        };

        const startDrift = () => {
            stopDrift();
            heroContent.classList.add('drifting');
            const friction = 0.96;
            const springBack = 0.02;
            const step = () => {
                // Weightless deceleration
                velX *= friction;
                velY *= friction;
                // Gentle pull back toward resting position (0,0)
                velX += -dragX * springBack;
                velY += -dragY * springBack;

                dragX += velX;
                dragY += velY;
                applyTransform();

                if (Math.abs(velX) > 0.03 || Math.abs(velY) > 0.03 || Math.abs(dragX) > 0.5 || Math.abs(dragY) > 0.5) {
                    driftFrame = requestAnimationFrame(step);
                } else {
                    dragX = 0;
                    dragY = 0;
                    applyTransform();
                    driftFrame = null;
                    heroContent.classList.remove('drifting');
                }
            };
            driftFrame = requestAnimationFrame(step);
        };

        heroContent.addEventListener('mousedown', (e) => {
            isDragging = true;
            stopDrift();
            heroContent.classList.remove('drifting');
            heroContent.classList.add('dragging');
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            dragOriginX = dragX;
            dragOriginY = dragY;
            lastPointerX = e.clientX;
            lastPointerY = e.clientY;
            lastPointerTime = performance.now();
            velX = 0;
            velY = 0;
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const now = performance.now();
            const dt = Math.max(now - lastPointerTime, 1);
            velX = ((e.clientX - lastPointerX) / dt) * 16; // px per frame (~60fps)
            velY = ((e.clientY - lastPointerY) / dt) * 16;
            lastPointerX = e.clientX;
            lastPointerY = e.clientY;
            lastPointerTime = now;

            dragX = dragOriginX + (e.clientX - dragStartX);
            dragY = dragOriginY + (e.clientY - dragStartY);
            applyTransform();
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            heroContent.classList.remove('dragging');
            startDrift();
        });

        heroSection.addEventListener('mousemove', (e) => {
            if (isDragging) return;
            const rect = heroSection.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
            const relY = (e.clientY - rect.top) / rect.height - 0.5;
            tiltX = relX * -14;
            tiltY = relY * -10;
            applyTransform();
        });

        heroSection.addEventListener('mouseleave', () => {
            if (isDragging) return;
            tiltX = 0;
            tiltY = 0;
            applyTransform();
        });
    }

    // Astronaut: roams the whole page (fixed), reacts to cursor proximity, and can be thrown
    const astronaut = document.getElementById('astronaut');
    const astronautTilt = astronaut ? astronaut.querySelector('.astronaut-tilt') : null;

    if (astronaut && astronautTilt && window.matchMedia('(min-width: 769px)').matches) {
        // Single source of truth for the astronaut's screen position (px from top-left)
        let posX = window.innerWidth * 0.78;
        let posY = window.innerHeight * 0.2;
        let wanderTargetX = posX;
        let wanderTargetY = posY;
        let wanderTimer = null;

        let isThrowDragging = false;
        let grabOffsetX = 0, grabOffsetY = 0;
        let throwVelX = 0, throwVelY = 0;
        let lastGrabX = 0, lastGrabY = 0;
        let lastGrabTime = 0;
        let inMomentum = false;

        // Cursor-proximity nudge (eased, not snapped)
        let pushX = 0, pushY = 0, pushRot = 0;
        let targetPushX = 0, targetPushY = 0, targetPushRot = 0;

        // Direction-of-travel bank/tilt
        let prevPosX = posX;
        let prevPosY = posY;
        let bankRot = 0;
        let bobPhase = Math.random() * Math.PI * 2;

        const friction = 0.985;

        // Single render loop: position (JS-driven) + idle bob + bank + cursor nudge, all composed once
        const renderLoop = () => {
            bobPhase += 0.02;
            const idleBobY = Math.sin(bobPhase) * 5;
            const idleBobX = Math.sin(bobPhase * 0.5) * 3;
            // Small fast wobble + slow lazy tumble, like drifting in zero-G
            const idleBobRot = Math.sin(bobPhase * 0.7) * 4 + Math.sin(bobPhase * 0.13) * 14;

            const dx = posX - prevPosX;
            const dy = posY - prevPosY;
            prevPosX = posX;
            prevPosY = posY;
            const speed = Math.sqrt(dx * dx + dy * dy);
            const targetBank = speed > 0.05 ? Math.max(-30, Math.min(30, dx * 3)) : 0;
            bankRot += (targetBank - bankRot) * 0.08;

            pushX += (targetPushX - pushX) * 0.15;
            pushY += (targetPushY - pushY) * 0.15;
            pushRot += (targetPushRot - pushRot) * 0.15;

            astronaut.style.transform = `translate(${posX}px, ${posY}px)`;
            astronautTilt.style.transform =
                `translate(${(idleBobX + pushX).toFixed(2)}px, ${(idleBobY + pushY).toFixed(2)}px) rotate(${(idleBobRot + bankRot + pushRot).toFixed(2)}deg)`;
            // Limbs counter-rotate against the bank so they trail behind the motion
            astronautTilt.style.setProperty('--trail', `${(-bankRot * 0.9).toFixed(2)}deg`);

            requestAnimationFrame(renderLoop);
        };
        requestAnimationFrame(renderLoop);

        const stopMomentum = () => { inMomentum = false; };

        // Idle wander: glide toward a new random point every few seconds
        const pickWanderTarget = () => {
            wanderTargetX = window.innerWidth * (0.08 + Math.random() * 0.82);
            wanderTargetY = window.innerHeight * (0.1 + Math.random() * 0.65);
        };

        const startWandering = () => {
            clearInterval(wanderTimer);
            pickWanderTarget();
            wanderTimer = setInterval(pickWanderTarget, 6000);
        };

        const wanderStep = () => {
            if (!isThrowDragging && !inMomentum) {
                posX += (wanderTargetX - posX) * 0.008;
                posY += (wanderTargetY - posY) * 0.008;
            }
            requestAnimationFrame(wanderStep);
        };
        startWandering();
        requestAnimationFrame(wanderStep);

        // Throw physics: after release, keep momentum and bounce softly off screen edges
        const startThrowMomentum = () => {
            inMomentum = true;
            const margin = 10;

            const step = () => {
                if (!inMomentum) return;
                const maxX = window.innerWidth - astronaut.offsetWidth - margin;
                const maxY = window.innerHeight - astronaut.offsetHeight - margin;

                throwVelX *= friction;
                throwVelY *= friction;

                posX += throwVelX;
                posY += throwVelY;

                if (posX < margin) { posX = margin; throwVelX *= -0.4; }
                if (posX > maxX) { posX = maxX; throwVelX *= -0.4; }
                if (posY < margin) { posY = margin; throwVelY *= -0.4; }
                if (posY > maxY) { posY = maxY; throwVelY *= -0.4; }

                if (Math.abs(throwVelX) > 0.05 || Math.abs(throwVelY) > 0.05) {
                    requestAnimationFrame(step);
                } else {
                    inMomentum = false;
                    wanderTargetX = posX;
                    wanderTargetY = posY;
                    startWandering(); // resume idle wandering from here
                }
            };
            requestAnimationFrame(step);
        };

        let mouseDownX = 0, mouseDownY = 0, mouseDownTime = 0;

        astronaut.addEventListener('mousedown', (e) => {
            isThrowDragging = true;
            stopMomentum();
            clearInterval(wanderTimer);
            astronaut.classList.add('grabbed');
            grabOffsetX = e.clientX - posX;
            grabOffsetY = e.clientY - posY;
            lastGrabX = e.clientX;
            lastGrabY = e.clientY;
            lastGrabTime = performance.now();
            mouseDownX = e.clientX;
            mouseDownY = e.clientY;
            mouseDownTime = performance.now();
            throwVelX = 0;
            throwVelY = 0;
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (isThrowDragging) {
                const now = performance.now();
                const dt = Math.max(now - lastGrabTime, 1);
                throwVelX = ((e.clientX - lastGrabX) / dt) * 16;
                throwVelY = ((e.clientY - lastGrabY) / dt) * 16;
                lastGrabX = e.clientX;
                lastGrabY = e.clientY;
                lastGrabTime = now;

                posX = e.clientX - grabOffsetX;
                posY = e.clientY - grabOffsetY;
                return;
            }

            const astroRect = astronaut.getBoundingClientRect();
            const astroCenterX = astroRect.left + astroRect.width / 2;
            const astroCenterY = astroRect.top + astroRect.height / 2;
            const dx = e.clientX - astroCenterX;
            const dy = e.clientY - astroCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const proximity = Math.max(0, 1 - dist / 220); // 0 far, 1 very close

            if (proximity > 0.02) {
                targetPushX = -(dx / (dist || 1)) * proximity * 30;
                targetPushY = -(dy / (dist || 1)) * proximity * 30;
                targetPushRot = (dx / (dist || 1)) * proximity * 25;
                astronaut.classList.add('thrusting');
            } else {
                targetPushX = 0;
                targetPushY = 0;
                targetPushRot = 0;
                astronaut.classList.remove('thrusting');
            }
        }, { passive: false });

        // Give Oxygen: a click (not a throw) on the astronaut, only meaningful when logged in
        const giveOxygen = () => {
            const userSession = JSON.parse(localStorage.getItem('discord_user') || 'null');
            const authed = userSession ? userSession.authenticated : false;

            if (!authed) {
                if (typeof showModal === 'function') showModal();
                return;
            }

            astronaut.classList.remove('oxygen-given');
            // Force reflow so the animation can retrigger on repeated clicks
            void astronaut.offsetWidth;
            astronaut.classList.add('oxygen-given');

            const bubble = document.createElement('div');
            bubble.className = 'oxygen-bubble';
            bubble.textContent = 'O₂ +1';
            astronaut.appendChild(bubble);
            bubble.addEventListener('animationend', () => bubble.remove());

            const toast = document.createElement('div');
            toast.className = 'oxygen-toast';
            toast.textContent = 'Oxygen delivered! Thanks for keeping him alive out there.';
            document.body.appendChild(toast);
            requestAnimationFrame(() => toast.classList.add('visible'));
            setTimeout(() => {
                toast.classList.remove('visible');
                setTimeout(() => toast.remove(), 400);
            }, 2600);
        };

        window.addEventListener('mouseup', (e) => {
            if (!isThrowDragging) return;
            isThrowDragging = false;
            astronaut.classList.remove('grabbed');

            const movedDist = Math.hypot(e.clientX - mouseDownX, e.clientY - mouseDownY);
            const heldTime = performance.now() - mouseDownTime;
            const wasClick = movedDist < 6 && heldTime < 350;

            if (wasClick) {
                giveOxygen();
            } else {
                startThrowMomentum();
            }
        });
    }

});


