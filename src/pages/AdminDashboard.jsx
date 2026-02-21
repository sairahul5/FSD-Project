import { useEffect, useState } from 'react'
import {
  createUser,
  updateUser,
  deleteUser,
  getAdminStats,
  listUsers,
  listAdminHomestays,
  createAdminHomestay,
  updateAdminHomestay,
  deleteAdminHomestay,
  listAdminBookings,
  updateAdminBooking,
  deleteAdminBooking,
  listAdminChats,
  deleteAdminChat,
} from '../api/admin'
import {
  createHomePageContainer,
  deleteHomePageContainer,
  getHomePage,
  listHomePageContainers,
  updateHomePage,
  updateHomePageContainer,
} from '../api/homepage'
import {
  createAboutContainer,
  deleteAboutContainer,
  listAboutContainers,
  updateAboutContainer,
} from '../api/about'
import { getUser } from '../api/session'
import './AdminDashboard.css'

const tabs = ['overview', 'users', 'homestays', 'bookings', 'chats', 'homepage', 'about']

const StatCard = ({ label, value, color }) => (
  <div className="stat-card">
    <div className="stat-card__label">{label}</div>
    <div className="stat-card__value">{value}</div>
    <div className="stat-card__progress">
      <div className="stat-card__bar" style={{ width: '70%', backgroundColor: color || '#4f46e5' }}></div>
    </div>
  </div>
)

const ProfileCard = ({ user }) => (
  <div className="profile-card">
    <div className="profile-card__avatar">
      {user?.email?.[0]?.toUpperCase() || 'A'}
    </div>
    <div className="profile-card__name">{user?.email || 'Admin User'}</div>
    <div className="profile-card__role">{user?.role || 'ADMIN'}</div>
    <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${user?.mfaEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      MFA: {user?.mfaEnabled ? 'Enabled' : 'Disabled'}
    </div>
  </div>
)

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentUser] = useState(() => getUser())
  const [users, setUsers] = useState([])
  const [homestays, setHomestays] = useState([])
  const [bookings, setBookings] = useState([])
  const [chats, setChats] = useState([])
  const [status, setStatus] = useState('')
  const [stats, setStats] = useState({
    userCount: 0,
    homestayCount: 0,
    bookingCount: 0,
    chatCount: 0,
  })

  // Forms states
  const [editorForm, setEditorForm] = useState({ fullName: '', email: '', password: '' })
  const [editingUser, setEditingUser] = useState(null)
  
  const [newHomestay, setNewHomestay] = useState({
    name: '', location: '', placeName: '', country: '', state: '', district: '',
    city: '', town: '', village: '', imageUrl: '', pricePerNight: '', description: '', hostId: '',
  })
  const [editingHomestay, setEditingHomestay] = useState(null)
  const [homestayFilters, setHomestayFilters] = useState({
    query: '', country: '', state: '', district: '', city: '', town: '', village: '', placeName: '',
  })

  const [homepage, setHomepage] = useState({}) 
  const [homepageStatus, setHomepageStatus] = useState('')
  const [homepageContainers, setHomepageContainers] = useState([])
  const [containerForm, setContainerForm] = useState({ title: '', description: '', metricKey: '', visible: true, sortOrder: 0 })
  const [containerStatus, setContainerStatus] = useState('')
  
  const [aboutPeople, setAboutPeople] = useState([])
  const [aboutForm, setAboutForm] = useState({ name: '', role: '', bio: '', imageUrl: '', infoEntries: [], links: [], visible: true, sortOrder: 0 })
  const [aboutStatus, setAboutStatus] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setStatus('Loading data...')
      try {
        const statsData = await getAdminStats().catch(() => ({ userCount: 0, homestayCount: 0, bookingCount: 0, chatCount: 0 }))
        setStats(statsData)

        if (activeTab === 'overview') {
            const [recentBookings, recentChats] = await Promise.all([
                listAdminBookings().catch(() => []),
                listAdminChats().catch(() => [])
            ])
            setBookings(recentBookings.slice(0, 5)) 
            setChats(recentChats.slice(0, 5))
        } else if (activeTab === 'users') {
          setUsers(await listUsers())
        } else if (activeTab === 'homestays') {
          setHomestays(await listAdminHomestays(homestayFilters))
        } else if (activeTab === 'bookings') {
          setBookings(await listAdminBookings())
        } else if (activeTab === 'chats') {
          setChats(await listAdminChats())
        } else if (activeTab === 'homepage') {
          const data = await getHomePage()
          const containers = await listHomePageContainers()
          setHomepage(data)
          setHomepageContainers(containers)
        } else if (activeTab === 'about') {
          setAboutPeople(await listAboutContainers())
        }
        setStatus('')
      } catch (error) {
        setStatus(error.message || 'Failed to load data')
      }
    }

    loadData()
  }, [activeTab])

  // Handlers
  const handleCreateEditor = async (e) => {
    e.preventDefault(); setStatus('Creating...'); try { await createUser({...editorForm, role:'EDITOR'}); setEditorForm({fullName:'',email:'',password:''}); setUsers(await listUsers()); setStatus('Done'); } catch(err){ setStatus(err.message); }
  }
  const handleDeleteUser = async (id) => { setStatus('Deleting...'); try { await deleteUser(id); setUsers(await listUsers()); setStatus('Done'); } catch(err){ setStatus(err.message); } }
  const handleStartEditUser = (u) => setEditingUser({ id: u.id, fullName: u.fullName || '', role: u.role, password: '' })
  const handleUpdateUser = async (e) => { e.preventDefault(); try { await updateUser(editingUser.id, editingUser); setEditingUser(null); setUsers(await listUsers()); } catch(err){} }

  const handleCreateHomestay = async (e) => { e.preventDefault(); setStatus('Creating...'); try { await createAdminHomestay({...newHomestay, pricePerNight: Number(newHomestay.pricePerNight), hostId: Number(newHomestay.hostId)}); setHomestays(await listAdminHomestays(homestayFilters)); setStatus('Done'); setNewHomestay({name:'', location:'', placeName:'', country:'', state:'', district:'', city:'', town:'', village:'', imageUrl:'', pricePerNight:'', description:'', hostId:''}); } catch(err){ setStatus(err.message); } }
  const handleStartEditHomestay = (h) => setEditingHomestay({...h, pricePerNight: h.pricePerNight || '', description: h.description || ''})
  const handleUpdateHomestay = async (e) => { e.preventDefault(); try { await updateAdminHomestay(editingHomestay.id, {...editingHomestay, pricePerNight: Number(editingHomestay.pricePerNight)}); setEditingHomestay(null); setHomestays(await listAdminHomestays(homestayFilters)); } catch(err){} }
  const handleDeleteHomestay = async (id) => { try { await deleteAdminHomestay(id); setHomestays(await listAdminHomestays(homestayFilters)); } catch(err){} }
  const handleHomestayFilterApply = async () => setHomestays(await listAdminHomestays(homestayFilters))
  const handleHomestayFilterReset = async () => { setHomestayFilters({query: '', country: '', state: '', district: '', city: '', town: '', village: '', placeName: ''}); setHomestays(await listAdminHomestays()) }

  const handleBookingStatusChange = async (id, s) => { try { await updateAdminBooking(id, {status: s}); setBookings(await listAdminBookings()); } catch(err){} }
  const handleDeleteBooking = async (id) => { try { await deleteAdminBooking(id); setBookings(await listAdminBookings()); } catch(err){} }
  const handleDeleteChat = async (id) => { try { await deleteAdminChat(id); setChats(await listAdminChats()); } catch(err){} }

  const handleHomepageSave = async (e) => { e.preventDefault(); try { await updateHomePage(homepage); setHomepageStatus('Saved'); } catch(err){ setHomepageStatus(err.message); } }
  const handleContainerCreate = async (e) => { e.preventDefault(); try { await createHomePageContainer(containerForm); setHomepageContainers(await listHomePageContainers()); setContainerForm({...containerForm, title:''}); } catch(err){} }
  const handleContainerUpdate = async (id, updates) => { try { await updateHomePageContainer(id, updates); setHomepageContainers(await listHomePageContainers()); } catch(err){} }
  const handleContainerDelete = async (id) => { try { await deleteHomePageContainer(id); setHomepageContainers(await listHomePageContainers()); } catch(err){} }
  
  const handleAboutCreate = async (e) => { e.preventDefault(); try { await createAboutContainer(aboutForm); setAboutPeople(await listAboutContainers()); } catch(err){} }
  const cleanInfoEntries = (entries) => (entries||[]).map(e=>({label:e.label||'', value:e.value||''})).filter(e=>e.label||e.value)
  const cleanLinks = (links) => (links||[]).map(l=>({label:l.label||'', url:l.url||''})).filter(l=>l.label||l.url)
  const handleAboutUpdate = async (p) => { try { await updateAboutContainer(p.id, {...p, infoEntries:cleanInfoEntries(p.infoEntries), links:cleanLinks(p.links)}); setAboutPeople(await listAboutContainers()); } catch(err){} }
  const handleAboutDelete = async (id) => { try { await deleteAboutContainer(id); setAboutPeople(await listAboutContainers()); } catch(err){} }
  const handleFormInfoAdd = () => setAboutForm(prev => ({...prev, infoEntries: [...prev.infoEntries, {label:'', value:''}] }))
  const handleFormInfoChange = (idx, f, v) => setAboutForm(prev => ({...prev, infoEntries: prev.infoEntries.map((e,i)=>i===idx?{...e,[f]:v}:e) }))
  const handleFormInfoRemove = (idx) => setAboutForm(prev => ({...prev, infoEntries: prev.infoEntries.filter((_,i)=>i!==idx) }))
  const handleFormLinkAdd = () => setAboutForm(prev => ({...prev, links: [...prev.links, {label:'', url:''}] }))
  const handleFormLinkChange = (idx, f, v) => setAboutForm(prev => ({...prev, links: prev.links.map((e,i)=>i===idx?{...e,[f]:v}:e) }))
  const handleFormLinkRemove = (idx) => setAboutForm(prev => ({...prev, links: prev.links.filter((_,i)=>i!==idx) }))
  
  const handlePersonInfoAdd = (pid) => setAboutPeople(prev => prev.map(p => p.id===pid ? {...p, infoEntries:[...(p.infoEntries||[]), {label:'', value:''}]} : p))
  const handlePersonInfoChange = (pid, idx, f, v) => setAboutPeople(prev => prev.map(p => p.id===pid ? {...p, infoEntries:(p.infoEntries||[]).map((e,i)=>i===idx?{...e,[f]:v}:e)} : p))
  const handlePersonInfoRemove = (pid, idx) => setAboutPeople(prev => prev.map(p => p.id===pid ? {...p, infoEntries:(p.infoEntries||[]).filter((_,i)=>i!==idx)} : p))
  const handlePersonLinkAdd = (pid) => setAboutPeople(prev => prev.map(p => p.id===pid ? {...p, links:[...(p.links||[]), {label:'', url:''}]} : p))
  const handlePersonLinkChange = (pid, idx, f, v) => setAboutPeople(prev => prev.map(p => p.id===pid ? {...p, links:(p.links||[]).map((e,i)=>i===idx?{...e,[f]:v}:e)} : p))
  const handlePersonLinkRemove = (pid, idx) => setAboutPeople(prev => prev.map(p => p.id===pid ? {...p, links:(p.links||[]).filter((_,i)=>i!==idx)} : p))

  return (
    <main className="admin">
      <header className="admin__header">
        <h1 className="admin__title">Admin Dashboard</h1>
        <div className="admin__tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`admin__tab${activeTab === tab ? ' admin__tab--active' : ''}`}
              type="button"
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {status && <div className="p-4 mb-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">{status}</div>}

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="dashboard-view">
          <div className="dashboard-top">
            <ProfileCard user={currentUser} />
            <div className="dashboard-grid">
               <StatCard label="Users" value={stats.userCount} color="#3b82f6" />
               <StatCard label="Homestays" value={stats.homestayCount} color="#10b981" />
               <StatCard label="Bookings" value={stats.bookingCount} color="#f59e0b" />
               <StatCard label="Chats" value={stats.chatCount} color="#ec4899" />
            </div>
          </div>

          <div className="dashboard-split">
             <div className="card">
                <div className="card__header"><h3 className="card__title">Recent Bookings</h3></div>
                <div className="activity-list">
                    {bookings.length === 0 ? <p className="text-gray-500 py-4">No recent bookings.</p> : bookings.map(b => (
                        <div key={b.id} className="activity-item">
                            <div className="activity-item__main">
                                <span className="activity-item__title">Booking #{b.id}</span>
                                <span className="activity-item__meta">{b.checkIn} - {b.checkOut}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${b.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{b.status}</span>
                        </div>
                    ))}
                </div>
             </div>
             
             <div className="card">
                <div className="card__header"><h3 className="card__title">Recent Chats</h3></div>
                <div className="activity-list">
                    {chats.length === 0 ? <p className="text-gray-500 py-4">No recent messages.</p> : chats.map(c => (
                        <div key={c.id} className="activity-item">
                            <div className="activity-item__main">
                                <span className="activity-item__title">{c.username}</span>
                                <span className="activity-item__meta truncate max-w-[200px]">{c.content}</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin__section card">
           <div className="card__header"><h3 className="card__title">Manage Users</h3></div>
           <form className="admin__form mb-8 border-b pb-8" onSubmit={handleCreateEditor}>
              <h4 className="text-sm font-semibold mb-4 uppercase text-gray-500">Add New Editor</h4>
              <div className="admin__grid">
                <div className="admin__field"><label>Full Name</label><input value={editorForm.fullName} onChange={e=>setEditorForm({...editorForm, fullName: e.target.value})} /></div>
                <div className="admin__field"><label>Email</label><input type="email" value={editorForm.email} onChange={e=>setEditorForm({...editorForm, email: e.target.value})} /></div>
                <div className="admin__field admin__field--full"><label>Password</label><input type="password" value={editorForm.password} onChange={e=>setEditorForm({...editorForm, password: e.target.value})} /></div>
              </div>
              <div className="mt-4"><button className="admin__button" type="submit">Create Editor</button></div>
           </form>
           
           {editingUser && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-bold mb-4">Edit User #{editingUser.id}</h4>
                  <form onSubmit={handleUpdateUser} className="admin__grid">
                      <div className="admin__field"><label>Full Name</label><input value={editingUser.fullName} onChange={e=>setEditingUser({...editingUser, fullName:e.target.value})} /></div>
                      <div className="admin__field"><label>Role</label><select value={editingUser.role} onChange={e=>setEditingUser({...editingUser, role:e.target.value})}><option value="ADMIN">ADMIN</option><option value="EDITOR">EDITOR</option><option value="HOST">HOST</option><option value="TOURIST">TOURIST</option></select></div>
                      <div className="admin__field admin__field--full"><label>New Password (Optional)</label><input type="password" value={editingUser.password} onChange={e=>setEditingUser({...editingUser, password:e.target.value})} /></div>
                      <div className="admin__field--full flex gap-2 pt-4 border-t mt-4">
                          <button className="admin__button" type="submit">Update User</button>
                          <button className="admin__ghost" onClick={()=>setEditingUser(null)}>Cancel</button>
                      </div>
                  </form>
              </div>
           )}

           <div className="admin__list">
              {users.map(u => (
                  <div key={u.id} className="admin__row">
                      <div>
                          <div className="font-medium text-gray-900">{u.fullName || 'No Name'}</div>
                          <div className="text-sm text-gray-500">{u.email} · <span className="bg-gray-100 px-2 rounded-full text-xs">{u.role}</span> · <span className={`px-2 rounded-full text-xs ${u.mfaEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{u.mfaEnabled ? 'MFA ON' : 'MFA OFF'}</span></div>
                      </div>
                      <div className="flex gap-2">
                          <button className="admin__ghost text-xs" onClick={()=>handleStartEditUser(u)}>Edit</button>
                          <button className="admin__ghost text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={()=>handleDeleteUser(u.id)}>Delete</button>
                      </div>
                  </div>
              ))}
           </div>
        </div>
      )}

      {/* Homestays Tab */}
      {activeTab === 'homestays' && (
        <div className="admin__section">
            <div className="card mb-6">
                <div className="card__header"><h3 className="card__title">Homestays</h3></div>
                
                <div className="mb-6 p-4 bg-gray-50 rounded-100">
                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Filters</h4>
                    <div className="admin__grid admin__grid--4 gap-4">
                        <input placeholder="Search..." className="p-2 border rounded w-full" value={homestayFilters.query} onChange={e => setHomestayFilters({...homestayFilters, query: e.target.value})} />
                        <input placeholder="Country" className="p-2 border rounded w-full" value={homestayFilters.country} onChange={e => setHomestayFilters({...homestayFilters, country: e.target.value})} />
                        <div className="col-span-2 flex gap-2">
                            <button className="admin__button text-sm" onClick={handleHomestayFilterApply}>Apply Filters</button>
                            <button className="admin__ghost text-sm" onClick={handleHomestayFilterReset}>Clear</button>
                        </div>
                    </div>
                </div>

                <div className="admin__list">
                    {homestays.map(h => (
                        <div key={h.id} className="admin__row">
                             <div className="flex items-center gap-4">
                                {h.imageUrl && <img src={h.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />}
                                <div>
                                    <div className="font-medium">{h.name}</div>
                                    <div className="text-xs text-gray-500">{h.location} · ${h.pricePerNight}/night</div>
                                </div>
                             </div>
                             <div className="flex gap-2">
                                <button className="admin__ghost text-xs" onClick={()=>handleStartEditHomestay(h)}>Edit</button>
                                <button className="admin__ghost text-xs text-red-600" onClick={()=>handleDeleteHomestay(h.id)}>Delete</button>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <div className="card__header"><h3 className="card__title">Add New Homestay</h3></div>
                <form onSubmit={handleCreateHomestay} className="admin__grid">
                    <div className="admin__field"><label>Name</label><input value={newHomestay.name} onChange={e=>setNewHomestay({...newHomestay, name:e.target.value})} /></div>
                    <div className="admin__field"><label>Location</label><input value={newHomestay.location} onChange={e=>setNewHomestay({...newHomestay, location:e.target.value})} /></div>
                    <div className="admin__field"><label>Price</label><input type="number" value={newHomestay.pricePerNight} onChange={e=>setNewHomestay({...newHomestay, pricePerNight:e.target.value})} /></div>
                    <div className="admin__field"><label>Host ID</label><input type="number" value={newHomestay.hostId} onChange={e=>setNewHomestay({...newHomestay, hostId:e.target.value})} /></div>
                    <div className="admin__field admin__field--full"><label>Description</label><textarea rows="3" value={newHomestay.description} onChange={e=>setNewHomestay({...newHomestay, description:e.target.value})} /></div>
                    <div className="admin__field--full"><button className="admin__button" type="submit">Create Homestay</button></div>
                </form>
            </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
         <div className="admin__section card">
            <div className="card__header"><h3 className="card__title">All Bookings</h3></div>
            <div className="admin__list">
                {bookings.map(b => (
                    <div key={b.id} className="admin__row">
                        <div>
                            <div className="font-bold">booking #{b.id}</div>
                            <div className="text-sm">Status: <span className="font-medium">{b.status}</span></div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <select className="p-1 border rounded text-sm" value={b.status} onChange={e=>handleBookingStatusChange(b.id, e.target.value)}>
                                <option value="PENDING">PENDING</option>
                                <option value="APPROVED">APPROVED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                            <button className="text-red-600 hover:text-red-800" onClick={()=>handleDeleteBooking(b.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      )}

      {/* Chats Tab */}
      {activeTab === 'chats' && (
          <div className="admin__section card">
            <div className="card__header"><h3 className="card__title">All Messages</h3></div>
            <div className="admin__list">
                {chats.map(c => (
                    <div key={c.id} className="admin__row">
                        <div>
                            <div className="font-bold">{c.username}</div>
                            <div className="text-gray-600">{c.content}</div>
                        </div>
                        <button className="text-red-600 hover:text-red-800" onClick={()=>handleDeleteChat(c.id)}>Delete</button>
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* Homepage Tab (Simplified View) */}
      {activeTab === 'homepage' && (
          <div className="admin__section card">
              <div className="card__header"><h3 className="card__title">Homepage Configuration</h3></div>
              <form onSubmit={handleHomepageSave} className="admin__grid mb-8">
                  <div className="admin__field admin__field--full"><label>Hero Title</label><input value={homepage.heroTitle || ''} onChange={e=>setHomepage({...homepage, heroTitle:e.target.value})} /></div>
                  <div className="admin__field admin__field--full"><label>Hero Subtitle</label><textarea value={homepage.heroSubtitle || ''} onChange={e=>setHomepage({...homepage, heroSubtitle:e.target.value})} /></div>
                  <div className="admin__field--full"><button className="admin__button" type="submit">Save Changes</button></div>
                  {homepageStatus && <p className="text-green-600 mt-2 admin__field--full">{homepageStatus}</p>}
              </form>
              
              <div className="border-t pt-8">
                  <h4 className="font-bold mb-4">Manage Containers</h4>
                  <div className="admin__list mb-8">
                      {homepageContainers.length === 0 && <div className="p-4 text-center text-gray-500">No containers found.</div>}
                      {homepageContainers.map(c => (
                           <div key={c.id} className="admin__row">
                               <div className="flex flex-col">
                                   <span className="font-medium">{c.title}</span>
                                   <span className="text-xs text-gray-500">{c.metricKey ? `Metric: ${c.metricKey}` : 'Static Content'}</span>
                               </div>
                               <button className="admin__ghost text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={()=>handleContainerDelete(c.id)}>Delete</button>
                           </div>
                      ))}
                  </div>

                  <h4 className="font-bold mb-4 text-sm uppercase text-gray-500">Add New Container</h4>
                  <form onSubmit={handleContainerCreate} className="admin__grid">
                      <div className="admin__field"><label>Title</label><input value={containerForm.title} onChange={e=>setContainerForm({...containerForm, title:e.target.value})} /></div>
                      <div className="admin__field"><label>Metric Key</label><input value={containerForm.metricKey} onChange={e=>setContainerForm({...containerForm, metricKey:e.target.value})} placeholder="e.g. user_growth" /></div>
                      <div className="admin__field admin__field--full"><label>Description</label><textarea rows="2" value={containerForm.description} onChange={e=>setContainerForm({...containerForm, description:e.target.value})} /></div>
                      <div className="admin__field--full"><button className="admin__button" type="submit">Add Container</button></div>
                  </form>
              </div>
          </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
          <div className="admin__section card">
              <div className="card__header"><h3 className="card__title">About Page Team</h3></div>
              <div className="admin__list mb-8">
                  {aboutPeople.map(p => (
                      <div key={p.id} className="admin__row">
                          <div className="flex items-center gap-3">
                              {p.imageUrl && <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-full" />}
                              <div>
                                  <div className="font-bold">{p.name}</div>
                                  <div className="text-xs text-gray-500">{p.role}</div>
                              </div>
                          </div>
                          <button className="text-red-600" onClick={()=>handleAboutDelete(p.id)}>Remove</button>
                      </div>
                  ))}
              </div>
              
              <h4 className="font-bold mb-4">Add Team Member</h4>
              <form onSubmit={handleAboutCreate} className="admin__grid">
                  <div className="admin__field"><label>Name</label><input value={aboutForm.name} onChange={e=>setAboutForm({...aboutForm, name:e.target.value})} /></div>
                  <div className="admin__field"><label>Role</label><input value={aboutForm.role} onChange={e=>setAboutForm({...aboutForm, role:e.target.value})} /></div>
                  <div className="admin__field admin__field--full"><label>Profile Image URL</label><input value={aboutForm.imageUrl} onChange={e=>setAboutForm({...aboutForm, imageUrl:e.target.value})} placeholder="https://..." /></div>
                  <div className="admin__field admin__field--full"><label>Bio</label><textarea value={aboutForm.bio} onChange={e=>setAboutForm({...aboutForm, bio:e.target.value})} /></div>
                  <div className="admin__field--full"><button className="admin__button" type="submit">Add Member</button></div>
              </form>
          </div>
      )}

    </main>
  )
}

export default AdminDashboard
