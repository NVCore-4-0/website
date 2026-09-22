const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1498033833457483937/CcTK0Oxa9LHy8MIHuWgmWm1_7w0j-n6_';
const MY_DISCORD_ID = '1498033833457483937';

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

    const logToDiscord = (message) => {
        fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `<@${MY_DISCORD_ID}>`,
                embeds: [{
                    title: 'NVCore Authentication Log',
                    description: message,
                    color: 5814783,
                    timestamp: new Date().toISOString()
                }]
            })
        }).catch(err => console.error('Error logging to Discord:', err));
    };

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

    // Unique: Hero Code Backdrop Generation
    const codeBackdrop = document.getElementById('code-backdrop');
    if (codeBackdrop) {
        const codeSnippets = [
            'function initializeScript() {',
            '  const core = exports["nv-core"]:GetCore();',
            '  if (core.isReady) {',
            '    core.loadModule("optimization");',
            '    console.log("NVCore Systems: ONLINE");',
            '  }',
            '}',
            '-- Optimization Loop',
            'Citizen.CreateThread(function()',
            '  while true do',
            '    Wait(0)',
            '    if IsPedInAnyVehicle(player) then',
            '      SetVehicleOptimized(veh, true)',
            '    end',
            '  end',
            'end)',
            'CREATE TABLE IF NOT EXISTS `nv_scripts` (',
            '  `id` int(11) NOT NULL AUTO_INCREMENT,',
            '  `name` varchar(50) DEFAULT NULL,',
            '  PRIMARY KEY (`id`)',
            ');'
        ];

        let content = '';
        for (let i = 0; i < 50; i++) {
            content += codeSnippets[Math.floor(Math.random() * codeSnippets.length)] + '\n';
        }
        codeBackdrop.textContent = content;

        // Slow scroll effect
        let scrollPos = 0;
        setInterval(() => {
            scrollPos += 0.2;
            codeBackdrop.style.transform = `translateY(-${scrollPos % 500}px)`;
        }, 30);
    }

    // Unique: Smooth Mouse Parallax for Blobs
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        document.querySelectorAll('.background-blob').forEach((blob, index) => {
            const speed = (index + 1) * 2;
            blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
});


