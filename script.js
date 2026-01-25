let state = {
            view: 'landing',
            user: null, 
            searchQuery: '',
            events: [
                {
                    id: 1,
                    title: "Annual Tech Symposium 2024",
                    date: "2024-10-15",
                    time: "09:00 AM",
                    location: "Main Auditorium",
                    category: "Technology",
                    description: "Keynote speakers from top tech companies and student showcases.",
                    capacity: 200,
                    registrations: [101, 102],
                    image: "https://images.unsplash.com/photo-1540575861501-7ad05823c95b?auto=format&fit=crop&w=800&q=80"
                },
                {
                    id: 2,
                    title: "Inter-College Cricket Tournament",
                    date: "2024-11-05",
                    time: "08:00 AM",
                    location: "Sports Ground",
                    category: "Sports",
                    description: "High-stakes cricket tournament between top 8 colleges.",
                    capacity: 500,
                    registrations: [101],
                    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80"
                },
                {
                    id: 3,
                    title: "UI/UX Masterclass",
                    date: "2024-09-28",
                    time: "02:00 PM",
                    location: "Design Lab 4",
                    category: "Workshop",
                    description: "Learn fundamentals of user-centered design and Figma.",
                    capacity: 40,
                    registrations: [],
                    image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80"
                }
            ],
            deleteTargetId: null
        };

        // --- INITIALIZATION ---
        window.onload = () => {
            renderApp();
            lucide.createIcons();
        };

        // --- CORE FUNCTIONS ---
        function renderApp() {
            renderNav();
            renderViews();
            renderEventsGrid();
            renderUserDashboard();
            renderAdminPanel();
            lucide.createIcons();
        }

        function renderNav() {
            const authBtns = document.getElementById('auth-buttons');
            const profile = document.getElementById('user-profile');
            const navDashboard = document.getElementById('nav-dashboard');
            const navAdmin = document.getElementById('nav-admin');
            const userDisplay = document.getElementById('user-display-name');
            const userIconCont = document.getElementById('user-icon-container');

            const mDash = document.getElementById('mobile-nav-dashboard');
            const mAdmin = document.getElementById('mobile-nav-admin');
            const mAuth = document.getElementById('mobile-auth');
            const mLogout = document.getElementById('mobile-logout');

            if (state.user) {
                authBtns.classList.add('hidden');
                profile.classList.remove('hidden');
                userDisplay.innerText = state.user.name;
                mAuth.classList.add('hidden');
                mLogout.classList.remove('hidden');

                if (state.user.role === 'admin') {
                    navAdmin.classList.remove('hidden');
                    navDashboard.classList.add('hidden');
                    mAdmin.classList.remove('hidden');
                    mDash.classList.add('hidden');
                    userIconCont.innerHTML = '<i data-lucide="shield" class="w-3 h-3"></i>';
                } else {
                    navAdmin.classList.add('hidden');
                    navDashboard.classList.remove('hidden');
                    mAdmin.classList.add('hidden');
                    mDash.classList.remove('hidden');
                    userIconCont.innerHTML = '<i data-lucide="user" class="w-3 h-3"></i>';
                }
            } else {
                authBtns.classList.remove('hidden');
                profile.classList.add('hidden');
                navDashboard.classList.add('hidden');
                navAdmin.classList.add('hidden');
                mDash.classList.add('hidden');
                mAdmin.classList.add('hidden');
                mAuth.classList.remove('hidden');
                mLogout.classList.add('hidden');
            }
        }

        function renderViews() {
            document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));
            document.getElementById(`view-${state.view}`).classList.remove('hidden');
        }

        function renderEventsGrid() {
            const grid = document.getElementById('events-grid');
            const empty = document.getElementById('empty-search');
            
            const filtered = state.events.filter(ev => 
                ev.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                ev.category.toLowerCase().includes(state.searchQuery.toLowerCase())
            );

            grid.innerHTML = filtered.map(ev => {
                const isReg = state.user && ev.registrations.includes(state.user.id);
                const isFull = ev.registrations.length >= ev.capacity;
                const dateStr = new Date(ev.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

                return `
                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-fade-in">
                        <div class="relative h-56 overflow-hidden bg-gray-100">
                            <img src="${ev.image}" alt="${ev.title}" onerror="this.src='https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                            <div class="absolute top-4 left-4">
                                <span class="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-extrabold text-indigo-700 shadow-sm uppercase tracking-widest">${ev.category}</span>
                            </div>
                        </div>
                        <div class="p-8">
                            <h3 class="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-indigo-600 transition tracking-tight">${ev.title}</h3>
                            <div class="space-y-3 mb-6">
                                <div class="flex items-center text-gray-400 text-sm font-medium">
                                    <i data-lucide="calendar" class="w-4 h-4 mr-3 text-indigo-400"></i>
                                    <span>${dateStr}</span>
                                </div>
                                <div class="flex items-center text-gray-400 text-sm font-medium">
                                    <i data-lucide="clock" class="w-4 h-4 mr-3 text-indigo-400"></i>
                                    <span>${ev.time}</span>
                                </div>
                                <div class="flex items-center text-gray-400 text-sm font-medium">
                                    <i data-lucide="map-pin" class="w-4 h-4 mr-3 text-indigo-400"></i>
                                    <span>${ev.location}</span>
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-50">
                                <div class="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <span class="${isFull ? 'text-red-500' : 'text-indigo-600'}">
                                        ${ev.registrations.length}
                                    </span>
                                    / ${ev.capacity} joined
                                </div>
                                
                                ${isReg ? `
                                    <button disabled class="flex items-center text-green-600 font-bold text-xs uppercase tracking-widest px-4 py-2">
                                        <i data-lucide="check-circle" class="w-4 h-4 mr-2"></i>
                                        Registered
                                    </button>
                                ` : `
                                    <button 
                                        onclick="handleRegister(${ev.id})"
                                        ${isFull ? 'disabled' : ''}
                                        class="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isFull ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95'}"
                                    >
                                        ${isFull ? 'Full' : 'Join Event'}
                                    </button>
                                `}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            empty.classList.toggle('hidden', filtered.length > 0);
            lucide.createIcons();
        }

        function renderUserDashboard() {
            if (state.view !== 'dashboard') return;
            const list = document.getElementById('user-events-list');
            const myEvents = state.events.filter(ev => state.user && ev.registrations.includes(state.user.id));
            
            document.getElementById('welcome-message').innerText = `Welcome back, ${state.user.name}`;
            document.getElementById('reg-count').innerText = myEvents.length;
            document.getElementById('stat-total').innerText = myEvents.length;
            document.getElementById('stat-progress').style.width = myEvents.length > 0 ? '75%' : '10%';

            if (myEvents.length === 0) {
                list.innerHTML = `
                    <div class="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-16 text-center">
                        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i data-lucide="calendar" class="text-gray-300 w-8 h-8"></i>
                        </div>
                        <p class="text-gray-500 font-bold tracking-tight">No active registrations yet.</p>
                        <p class="text-gray-400 text-sm mt-1">Start exploring events to get started.</p>
                        <button onclick="switchView('landing')" class="mt-6 inline-flex items-center bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 px-6 py-3 rounded-xl transition active:scale-95">
                            Browse events <i data-lucide="chevron-right" class="w-4 h-4 ml-2"></i>
                        </button>
                    </div>
                `;
            } else {
                list.innerHTML = myEvents.map(ev => `
                    <div class="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all group">
                        <div class="flex items-center space-x-5">
                            <div class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                                <img src="${ev.image}" alt="" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900 group-hover:text-indigo-600 transition text-lg tracking-tight">${ev.title}</h4>
                                <div class="flex items-center text-sm text-gray-400 mt-1 font-medium">
                                    <i data-lucide="calendar" class="w-3.5 h-3.5 mr-2 text-indigo-400"></i> ${ev.date} 
                                    <span class="mx-2">•</span>
                                    <i data-lucide="clock" class="w-3.5 h-3.5 mr-2 text-indigo-400"></i> ${ev.time}
                                </div>
                            </div>
                        </div>
                        <button 
                            onclick="handleCancel(${ev.id})"
                            class="text-gray-300 hover:text-red-500 p-3 rounded-2xl hover:bg-red-50 transition-all active:scale-90"
                            title="Cancel Registration"
                        >
                            <i data-lucide="x-circle" class="w-6 h-6"></i>
                        </button>
                    </div>
                `).join('');
            }
            lucide.createIcons();
        }

        function renderAdminPanel() {
            if (state.view !== 'admin') return;
            const body = document.getElementById('admin-table-body');
            
            body.innerHTML = state.events.map(ev => {
                const progress = Math.min((ev.registrations.length / ev.capacity) * 100, 100);
                return `
                    <tr class="hover:bg-gray-50/50 transition-colors">
                        <td class="px-6 py-6">
                            <div class="flex items-center">
                                <div class="h-14 w-14 flex-shrink-0 rounded-2xl overflow-hidden mr-5 bg-gray-100 border border-gray-100 shadow-sm">
                                    <img src="${ev.image}" alt="" class="h-full w-full object-cover">
                                </div>
                                <div>
                                    <div class="text-sm font-extrabold text-gray-900 tracking-tight">${ev.title}</div>
                                    <div class="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">${ev.category} • ${ev.location}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-6 whitespace-nowrap">
                            <div class="text-sm text-gray-900 font-bold">${ev.date}</div>
                            <div class="text-xs text-gray-400 font-medium mt-1">${ev.time}</div>
                        </td>
                        <td class="px-6 py-6 whitespace-nowrap">
                            <div class="flex items-center text-xs mb-2">
                                <i data-lucide="users" class="w-3 h-3 mr-2 text-indigo-400"></i>
                                <span class="font-bold text-gray-900">${ev.registrations.length}</span>
                                <span class="text-gray-400 ml-1">/ ${ev.capacity}</span>
                            </div>
                            <div class="w-32 bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div 
                                    class="h-2 rounded-full transition-all duration-1000 ${ev.registrations.length >= ev.capacity ? 'bg-red-500' : 'bg-indigo-600'}"
                                    style="width: ${progress}%"
                                ></div>
                            </div>
                        </td>
                        <td class="px-6 py-6 whitespace-nowrap text-right">
                            <div class="flex justify-end space-x-2">
                                <button onclick="openModal(${ev.id})" class="text-indigo-400 hover:text-indigo-700 p-2.5 rounded-xl hover:bg-indigo-50 transition active:scale-90">
                                    <i data-lucide="edit-3" class="w-5 h-5"></i>
                                </button>
                                <button onclick="openConfirmModal(${ev.id})" class="text-red-300 hover:text-red-600 p-2.5 rounded-xl hover:bg-red-50 transition active:scale-90">
                                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
            lucide.createIcons();
        }

        // --- ACTIONS ---
        function switchView(view) {
            state.view = view;
            renderApp();
            window.scrollTo(0, 0);
        }

        function handleLogin(role) {
            state.user = {
                id: role === 'admin' ? 999 : 101,
                name: role === 'admin' ? 'Administrator' : 'Vinay',
                role: role
            };
            state.view = role === 'admin' ? 'admin' : 'dashboard';
            showToast(`Welcome, ${state.user.name}`);
            renderApp();
        }

        function handleLogout() {
            state.user = null;
            state.view = 'landing';
            showToast("Logged out successfully");
            renderApp();
        }

        function handleSearch(val) {
            state.searchQuery = val;
            renderEventsGrid();
        }

        function handleRegister(id) {
            if (!state.user) {
                handleLogin('user');
                return;
            }
            const event = state.events.find(ev => ev.id === id);
            if (event && !event.registrations.includes(state.user.id)) {
                event.registrations.push(state.user.id);
                showToast(`Successfully registered for ${event.title}`);
                renderApp();
            }
        }

        function handleCancel(id) {
            const event = state.events.find(ev => ev.id === id);
            if (event) {
                event.registrations = event.registrations.filter(uid => uid !== state.user.id);
                showToast("Registration cancelled");
                renderApp();
            }
        }

        // --- MODAL & FORM LOGIC ---
        function openModal(id = null) {
            const modal = document.getElementById('event-modal');
            const title = document.getElementById('modal-title');
            const btn = document.getElementById('submit-btn');
            const form = document.getElementById('event-form');
            
            form.reset();
            document.getElementById('edit-id').value = id || '';

            if (id) {
                const ev = state.events.find(e => e.id === id);
                title.innerText = "Edit Event Details";
                btn.innerText = "Update Event";
                document.getElementById('form-title').value = ev.title;
                document.getElementById('form-date').value = ev.date;
                document.getElementById('form-time').value = ev.time;
                document.getElementById('form-location').value = ev.location;
                document.getElementById('form-category').value = ev.category;
                document.getElementById('form-desc').value = ev.description;
                document.getElementById('form-capacity').value = ev.capacity;
            } else {
                title.innerText = "Launch New Event";
                btn.innerText = "Create Event";
            }

            modal.classList.remove('hidden');
            lucide.createIcons();
        }

        function closeModal() {
            document.getElementById('event-modal').classList.add('hidden');
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            const id = document.getElementById('edit-id').value;
            const data = {
                title: document.getElementById('form-title').value,
                date: document.getElementById('form-date').value,
                time: document.getElementById('form-time').value,
                location: document.getElementById('form-location').value,
                category: document.getElementById('form-category').value,
                description: document.getElementById('form-desc').value,
                capacity: parseInt(document.getElementById('form-capacity').value),
            };

            if (id) {
                const idx = state.events.findIndex(ev => ev.id === parseInt(id));
                state.events[idx] = { ...state.events[idx], ...data };
                showToast("Event updated successfully");
            } else {
                const newEv = {
                    ...data,
                    id: Date.now(),
                    registrations: [],
                    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"
                };
                state.events.unshift(newEv);
                showToast("Event published to campus");
            }

            closeModal();
            renderApp();
        }

        function openConfirmModal(id) {
            state.deleteTargetId = id;
            document.getElementById('confirm-modal').classList.remove('hidden');
            document.getElementById('confirm-delete-btn').onclick = () => {
                state.events = state.events.filter(ev => ev.id !== state.deleteTargetId);
                showToast("Event deleted permanently");
                closeConfirmModal();
                renderApp();
            };
        }

        function closeConfirmModal() {
            document.getElementById('confirm-modal').classList.add('hidden');
            state.deleteTargetId = null;
        }

        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            const icon = document.getElementById('menu-icon');
            const isHidden = menu.classList.contains('hidden');
            
            menu.classList.toggle('hidden');
            icon.setAttribute('data-lucide', isHidden ? 'x' : 'menu');
            lucide.createIcons();
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            const message = document.getElementById('toast-message');
            message.innerText = msg;
            toast.classList.remove('hidden');
            toast.classList.add('animate-fade-in');
            
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }