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
import './AdminDashboard.css'

const tabs = ['users', 'homestays', 'bookings', 'chats', 'homepage', 'about']

const emptyHomepage = {
  heroEyebrow: '',
  heroTitle: '',
  heroSubtitle: '',
  heroCtaPrimary: '',
  heroCtaSecondary: '',
  stat1Label: '',
  stat2Label: '',
  stat3Label: '',
  tile1Title: '',
  tile1Description: '',
  tile1Visible: true,
  tile2Title: '',
  tile2Description: '',
  tile2Visible: true,
  tile3Title: '',
  tile3Description: '',
  tile3Visible: true,
  flowTitle: '',
  flowSubtitle: '',
  flowVisible: true,
  step1Title: '',
  step1Description: '',
  step1Visible: true,
  step2Title: '',
  step2Description: '',
  step2Visible: true,
  step3Title: '',
  step3Description: '',
  step3Visible: true,
}

const emptyContainerForm = {
  title: '',
  description: '',
  metricKey: '',
  visible: true,
  sortOrder: 0,
}

const emptyAboutForm = {
  name: '',
  role: '',
  bio: '',
  imageUrl: '',
  infoEntries: [],
  links: [],
  visible: true,
  sortOrder: 0,
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users')
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

  const [editorForm, setEditorForm] = useState({ fullName: '', email: '', password: '' })
  const [editingUser, setEditingUser] = useState(null)
  const [newHomestay, setNewHomestay] = useState({
    name: '',
    location: '',
    placeName: '',
    country: '',
    state: '',
    district: '',
    city: '',
    town: '',
    village: '',
    imageUrl: '',
    pricePerNight: '',
    description: '',
    hostId: '',
  })
  const [editingHomestay, setEditingHomestay] = useState(null)
  const [homestayFilters, setHomestayFilters] = useState({
    query: '',
    country: '',
    state: '',
    district: '',
    city: '',
    town: '',
    village: '',
    placeName: '',
  })
  const [homepage, setHomepage] = useState(emptyHomepage)
  const [homepageStatus, setHomepageStatus] = useState('')
  const [homepageContainers, setHomepageContainers] = useState([])
  const [containerForm, setContainerForm] = useState(emptyContainerForm)
  const [containerStatus, setContainerStatus] = useState('')
  const [aboutPeople, setAboutPeople] = useState([])
  const [aboutForm, setAboutForm] = useState(emptyAboutForm)
  const [aboutStatus, setAboutStatus] = useState('')

  const barWidth = (value, allStats) => {
    const maxValue = Math.max(
      allStats.userCount,
      allStats.homestayCount,
      allStats.bookingCount,
      allStats.chatCount,
      1,
    )
    return Math.round((value / maxValue) * 100)
  }

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getAdminStats()
        setStats(data)
      } catch (error) {
        setStats({ userCount: 0, homestayCount: 0, bookingCount: 0, chatCount: 0 })
      }
    }

    loadStats()
  }, [activeTab])

  useEffect(() => {
    const load = async () => {
      setStatus('Loading...')
      try {
        if (activeTab === 'users') {
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
          setHomepage({
            heroEyebrow: data.heroEyebrow || '',
            heroTitle: data.heroTitle || '',
            heroSubtitle: data.heroSubtitle || '',
            heroCtaPrimary: data.heroCtaPrimary || '',
            heroCtaSecondary: data.heroCtaSecondary || '',
            stat1Label: data.stat1Label || '',
            stat2Label: data.stat2Label || '',
            stat3Label: data.stat3Label || '',
            tile1Title: data.tile1Title || '',
            tile1Description: data.tile1Description || '',
            tile1Visible: data.tile1Visible ?? true,
            tile2Title: data.tile2Title || '',
            tile2Description: data.tile2Description || '',
            tile2Visible: data.tile2Visible ?? true,
            tile3Title: data.tile3Title || '',
            tile3Description: data.tile3Description || '',
            tile3Visible: data.tile3Visible ?? true,
            flowTitle: data.flowTitle || '',
            flowSubtitle: data.flowSubtitle || '',
            flowVisible: data.flowVisible ?? true,
            step1Title: data.step1Title || '',
            step1Description: data.step1Description || '',
            step1Visible: data.step1Visible ?? true,
            step2Title: data.step2Title || '',
            step2Description: data.step2Description || '',
            step2Visible: data.step2Visible ?? true,
            step3Title: data.step3Title || '',
            step3Description: data.step3Description || '',
            step3Visible: data.step3Visible ?? true,
          })
          setHomepageContainers(containers)
        } else if (activeTab === 'about') {
          const people = await listAboutContainers()
          setAboutPeople(people)
        }
        setStatus('')
      } catch (error) {
        setStatus(error.message || 'Failed to load data')
      }
    }

    load()
  }, [activeTab])

  const handleCreateEditor = async (event) => {
    event.preventDefault()
    setStatus('Creating editor...')
    try {
      await createUser({
        fullName: editorForm.fullName,
        email: editorForm.email,
        password: editorForm.password,
        role: 'EDITOR',
      })
      setEditorForm({ fullName: '', email: '', password: '' })
      setUsers(await listUsers())
      setStatus('Editor created')
    } catch (error) {
      setStatus(error.message || 'Failed to create editor')
    }
  }

  const handleDeleteUser = async (id) => {
    setStatus('Deleting user...')
    try {
      await deleteUser(id)
      setUsers(await listUsers())
      setStatus('User deleted')
    } catch (error) {
      setStatus(error.message || 'Failed to delete user')
    }
  }

  const handleStartEditUser = (user) => {
    setEditingUser({
      id: user.id,
      fullName: user.fullName || '',
      role: user.role || 'TOURIST',
      password: '',
    })
  }

  const handleUpdateUser = async (event) => {
    event.preventDefault()
    if (!editingUser) {
      return
    }
    setStatus('Updating user...')
    try {
      await updateUser(editingUser.id, {
        fullName: editingUser.fullName,
        role: editingUser.role,
        password: editingUser.password,
      })
      setEditingUser(null)
      setUsers(await listUsers())
      setStatus('User updated')
    } catch (error) {
      setStatus(error.message || 'Failed to update user')
    }
  }

  const handleCreateHomestay = async (event) => {
    event.preventDefault()
    setStatus('Creating homestay...')
    try {
      await createAdminHomestay({
        name: newHomestay.name,
        location: newHomestay.location,
        placeName: newHomestay.placeName,
        country: newHomestay.country,
        state: newHomestay.state,
        district: newHomestay.district,
        city: newHomestay.city,
        town: newHomestay.town,
        village: newHomestay.village,
        imageUrl: newHomestay.imageUrl,
        description: newHomestay.description,
        pricePerNight: Number(newHomestay.pricePerNight),
        hostId: Number(newHomestay.hostId),
      })
      setNewHomestay({
        name: '',
        location: '',
        placeName: '',
        country: '',
        state: '',
        district: '',
        city: '',
        town: '',
        village: '',
        imageUrl: '',
        pricePerNight: '',
        description: '',
        hostId: '',
      })
      setHomestays(await listAdminHomestays(homestayFilters))
      setStatus('Homestay created')
    } catch (error) {
      setStatus(error.message || 'Failed to create homestay')
    }
  }

  const handleStartEditHomestay = (homestay) => {
    setEditingHomestay({
      id: homestay.id,
      name: homestay.name || '',
      location: homestay.location || '',
      placeName: homestay.placeName || '',
      country: homestay.country || '',
      state: homestay.state || '',
      district: homestay.district || '',
      city: homestay.city || '',
      town: homestay.town || '',
      village: homestay.village || '',
      imageUrl: homestay.imageUrl || '',
      pricePerNight: homestay.pricePerNight || '',
      description: homestay.description || '',
    })
  }

  const handleUpdateHomestay = async (event) => {
    event.preventDefault()
    if (!editingHomestay) {
      return
    }
    setStatus('Updating homestay...')
    try {
      await updateAdminHomestay(editingHomestay.id, {
        name: editingHomestay.name,
        location: editingHomestay.location,
        placeName: editingHomestay.placeName,
        country: editingHomestay.country,
        state: editingHomestay.state,
        district: editingHomestay.district,
        city: editingHomestay.city,
        town: editingHomestay.town,
        village: editingHomestay.village,
        imageUrl: editingHomestay.imageUrl,
        description: editingHomestay.description,
        pricePerNight: Number(editingHomestay.pricePerNight),
      })
      setEditingHomestay(null)
      setHomestays(await listAdminHomestays(homestayFilters))
      setStatus('Homestay updated')
    } catch (error) {
      setStatus(error.message || 'Failed to update homestay')
    }
  }

  const handleDeleteHomestay = async (id) => {
    setStatus('Deleting homestay...')
    try {
      await deleteAdminHomestay(id)
      setHomestays(await listAdminHomestays(homestayFilters))
      setStatus('Homestay deleted')
    } catch (error) {
      setStatus(error.message || 'Failed to delete homestay')
    }
  }

  const handleHomestayFilterApply = async () => {
    setStatus('Filtering homestays...')
    try {
      setHomestays(await listAdminHomestays(homestayFilters))
      setStatus('')
    } catch (error) {
      setStatus(error.message || 'Failed to filter homestays')
    }
  }

  const handleHomestayFilterReset = async () => {
    const cleared = {
      query: '',
      country: '',
      state: '',
      district: '',
      city: '',
      town: '',
      village: '',
      placeName: '',
    }
    setHomestayFilters(cleared)
    setStatus('Loading homestays...')
    try {
      setHomestays(await listAdminHomestays())
      setStatus('')
    } catch (error) {
      setStatus(error.message || 'Failed to load homestays')
    }
  }

  const handleBookingStatusChange = async (id, statusValue) => {
    setStatus('Updating booking...')
    try {
      await updateAdminBooking(id, { status: statusValue })
      setBookings(await listAdminBookings())
      setStatus('Booking updated')
    } catch (error) {
      setStatus(error.message || 'Failed to update booking')
    }
  }

  const handleDeleteBooking = async (id) => {
    setStatus('Deleting booking...')
    try {
      await deleteAdminBooking(id)
      setBookings(await listAdminBookings())
      setStatus('Booking deleted')
    } catch (error) {
      setStatus(error.message || 'Failed to delete booking')
    }
  }

  const handleDeleteChat = async (id) => {
    setStatus('Deleting message...')
    try {
      await deleteAdminChat(id)
      setChats(await listAdminChats())
      setStatus('Message deleted')
    } catch (error) {
      setStatus(error.message || 'Failed to delete message')
    }
  }

  const handleHomepageSave = async (event) => {
    event.preventDefault()
    setHomepageStatus('Saving homepage...')
    try {
      await updateHomePage(homepage)
      setHomepageStatus('Homepage updated')
    } catch (error) {
      setHomepageStatus(error.message || 'Failed to update homepage')
    }
  }

  const handleContainerCreate = async (event) => {
    event.preventDefault()
    setContainerStatus('Creating container...')
    try {
      await createHomePageContainer({
        title: containerForm.title,
        description: containerForm.description,
        metricKey: containerForm.metricKey || null,
        visible: containerForm.visible,
        sortOrder: Number(containerForm.sortOrder) || 0,
      })
      setContainerForm(emptyContainerForm)
      setHomepageContainers(await listHomePageContainers())
      setContainerStatus('Container created')
    } catch (error) {
      setContainerStatus(error.message || 'Failed to create container')
    }
  }

  const handleContainerUpdate = async (containerId, updates) => {
    setContainerStatus('Saving container...')
    try {
      await updateHomePageContainer(containerId, updates)
      setHomepageContainers(await listHomePageContainers())
      setContainerStatus('Container updated')
    } catch (error) {
      setContainerStatus(error.message || 'Failed to update container')
    }
  }

  const handleContainerDelete = async (containerId) => {
    setContainerStatus('Deleting container...')
    try {
      await deleteHomePageContainer(containerId)
      setHomepageContainers(await listHomePageContainers())
      setContainerStatus('Container deleted')
    } catch (error) {
      setContainerStatus(error.message || 'Failed to delete container')
    }
  }

  const cleanInfoEntries = (entries) =>
    (entries || [])
      .map((entry) => ({
        label: entry.label?.trim() || '',
        value: entry.value?.trim() || '',
      }))
      .filter((entry) => entry.label || entry.value)

  const cleanLinks = (links) =>
    (links || [])
      .map((link) => ({
        label: link.label?.trim() || '',
        url: link.url?.trim() || '',
      }))
      .filter((link) => link.label || link.url)

  const handleAboutCreate = async (event) => {
    event.preventDefault()
    setAboutStatus('Creating team member...')
    try {
      await createAboutContainer({
        name: aboutForm.name,
        role: aboutForm.role,
        bio: aboutForm.bio,
        imageUrl: aboutForm.imageUrl,
        infoEntries: cleanInfoEntries(aboutForm.infoEntries),
        links: cleanLinks(aboutForm.links),
        visible: aboutForm.visible,
        sortOrder: Number(aboutForm.sortOrder) || 0,
      })
      setAboutForm(emptyAboutForm)
      setAboutPeople(await listAboutContainers())
      setAboutStatus('Team member created')
    } catch (error) {
      setAboutStatus(error.message || 'Failed to create team member')
    }
  }

  const handleAboutUpdate = async (person) => {
    setAboutStatus('Saving team member...')
    try {
      await updateAboutContainer(person.id, {
        name: person.name,
        role: person.role,
        bio: person.bio,
        imageUrl: person.imageUrl,
        infoEntries: cleanInfoEntries(person.infoEntries),
        links: cleanLinks(person.links),
        visible: Boolean(person.visible),
        sortOrder: Number(person.sortOrder) || 0,
      })
      setAboutPeople(await listAboutContainers())
      setAboutStatus('Team member updated')
    } catch (error) {
      setAboutStatus(error.message || 'Failed to update team member')
    }
  }

  const handleAboutDelete = async (personId) => {
    setAboutStatus('Deleting team member...')
    try {
      await deleteAboutContainer(personId)
      setAboutPeople(await listAboutContainers())
      setAboutStatus('Team member deleted')
    } catch (error) {
      setAboutStatus(error.message || 'Failed to delete team member')
    }
  }

  const handleFormInfoChange = (index, field, value) => {
    setAboutForm((prev) => ({
      ...prev,
      infoEntries: prev.infoEntries.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry
      ),
    }))
  }

  const handleFormInfoAdd = () => {
    setAboutForm((prev) => ({
      ...prev,
      infoEntries: [...prev.infoEntries, { label: '', value: '' }],
    }))
  }

  const handleFormInfoRemove = (index) => {
    setAboutForm((prev) => ({
      ...prev,
      infoEntries: prev.infoEntries.filter((_, entryIndex) => entryIndex !== index),
    }))
  }

  const handleFormLinkChange = (index, field, value) => {
    setAboutForm((prev) => ({
      ...prev,
      links: prev.links.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry
      ),
    }))
  }

  const handleFormLinkAdd = () => {
    setAboutForm((prev) => ({
      ...prev,
      links: [...prev.links, { label: '', url: '' }],
    }))
  }

  const handleFormLinkRemove = (index) => {
    setAboutForm((prev) => ({
      ...prev,
      links: prev.links.filter((_, entryIndex) => entryIndex !== index),
    }))
  }

  const handlePersonInfoChange = (personId, index, field, value) => {
    setAboutPeople((prev) =>
      prev.map((person) =>
        person.id === personId
          ? {
              ...person,
              infoEntries: (person.infoEntries || []).map((entry, entryIndex) =>
                entryIndex === index ? { ...entry, [field]: value } : entry
              ),
            }
          : person
      )
    )
  }

  const handlePersonInfoAdd = (personId) => {
    setAboutPeople((prev) =>
      prev.map((person) =>
        person.id === personId
          ? {
              ...person,
              infoEntries: [...(person.infoEntries || []), { label: '', value: '' }],
            }
          : person
      )
    )
  }

  const handlePersonInfoRemove = (personId, index) => {
    setAboutPeople((prev) =>
      prev.map((person) =>
        person.id === personId
          ? {
              ...person,
              infoEntries: (person.infoEntries || []).filter((_, entryIndex) => entryIndex !== index),
            }
          : person
      )
    )
  }

  const handlePersonLinkChange = (personId, index, field, value) => {
    setAboutPeople((prev) =>
      prev.map((person) =>
        person.id === personId
          ? {
              ...person,
              links: (person.links || []).map((entry, entryIndex) =>
                entryIndex === index ? { ...entry, [field]: value } : entry
              ),
            }
          : person
      )
    )
  }

  const handlePersonLinkAdd = (personId) => {
    setAboutPeople((prev) =>
      prev.map((person) =>
        person.id === personId
          ? {
              ...person,
              links: [...(person.links || []), { label: '', url: '' }],
            }
          : person
      )
    )
  }

  const handlePersonLinkRemove = (personId, index) => {
    setAboutPeople((prev) =>
      prev.map((person) =>
        person.id === personId
          ? {
              ...person,
              links: (person.links || []).filter((_, entryIndex) => entryIndex !== index),
            }
          : person
      )
    )
  }

  return (
    <main className="admin">
      <section className="admin__panel app__panel">
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
                {tab}
              </button>
            ))}
          </div>
        </header>

        {status ? <p className="admin__status">{status}</p> : null}

        <section className="admin__stats">
          <div className="admin__stat">
            <div>
              <span>Users</span>
              <strong>{stats.userCount}</strong>
            </div>
            <div className="admin__bar">
              <div style={{ width: `${barWidth(stats.userCount, stats)}%` }} />
            </div>
          </div>
          <div className="admin__stat">
            <div>
              <span>Homestays</span>
              <strong>{stats.homestayCount}</strong>
            </div>
            <div className="admin__bar">
              <div style={{ width: `${barWidth(stats.homestayCount, stats)}%` }} />
            </div>
          </div>
          <div className="admin__stat">
            <div>
              <span>Bookings</span>
              <strong>{stats.bookingCount}</strong>
            </div>
            <div className="admin__bar">
              <div style={{ width: `${barWidth(stats.bookingCount, stats)}%` }} />
            </div>
          </div>
          <div className="admin__stat">
            <div>
              <span>Chats</span>
              <strong>{stats.chatCount}</strong>
            </div>
            <div className="admin__bar">
              <div style={{ width: `${barWidth(stats.chatCount, stats)}%` }} />
            </div>
          </div>
        </section>

        {activeTab === 'users' ? (
          <div className="admin__section">
            <form className="admin__form" onSubmit={handleCreateEditor}>
              <h2 className="admin__subtitle">Create editor</h2>
              <div className="admin__field">
                <label>Full name</label>
                <input
                  value={editorForm.fullName}
                  onChange={(event) =>
                    setEditorForm((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>Email</label>
                <input
                  type="email"
                  value={editorForm.email}
                  onChange={(event) =>
                    setEditorForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>Password</label>
                <input
                  type="password"
                  value={editorForm.password}
                  onChange={(event) =>
                    setEditorForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />
              </div>
              <button className="admin__button" type="submit">Create editor</button>
            </form>

            {editingUser ? (
              <form className="admin__form" onSubmit={handleUpdateUser}>
                <h2 className="admin__subtitle">Edit user</h2>
                <div className="admin__field">
                  <label>Full name</label>
                  <input
                    value={editingUser.fullName}
                    onChange={(event) =>
                      setEditingUser((prev) => ({ ...prev, fullName: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__field">
                  <label>Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(event) =>
                      setEditingUser((prev) => ({ ...prev, role: event.target.value }))
                    }
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="HOST">HOST</option>
                    <option value="TOURIST">TOURIST</option>
                  </select>
                </div>
                <div className="admin__field">
                  <label>Reset password</label>
                  <input
                    type="password"
                    value={editingUser.password}
                    onChange={(event) =>
                      setEditingUser((prev) => ({ ...prev, password: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__actions">
                  <button className="admin__button" type="submit">Save</button>
                  <button className="admin__ghost" type="button" onClick={() => setEditingUser(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}

            <div className="admin__list">
              {users.map((user) => (
                <div className="admin__row" key={user.id}>
                  <div>
                    <strong>{user.fullName || 'Unnamed'}</strong>
                    <div className="admin__meta">
                      {user.email} · {user.role} · MFA: {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div className="admin__actions">
                    <button className="admin__ghost" type="button" onClick={() => handleStartEditUser(user)}>
                      Edit
                    </button>
                    <button className="admin__ghost" type="button" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'homestays' ? (
          <div className="admin__section">
            <form className="admin__form" onSubmit={(event) => event.preventDefault()}>
              <h2 className="admin__subtitle">Filter homestays</h2>
              <div className="admin__grid">
                <label className="admin__field">
                  Search
                  <input
                    placeholder="Name or location"
                    value={homestayFilters.query}
                    onChange={(event) =>
                      setHomestayFilters((prev) => ({ ...prev, query: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Place name
                  <input
                    value={homestayFilters.placeName}
                    onChange={(event) =>
                      setHomestayFilters((prev) => ({ ...prev, placeName: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Country
                  <input
                    value={homestayFilters.country}
                    onChange={(event) =>
                      setHomestayFilters((prev) => ({ ...prev, country: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  State
                  <input
                    value={homestayFilters.state}
                    onChange={(event) =>
                      setHomestayFilters((prev) => ({ ...prev, state: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  District
                  <input
                    value={homestayFilters.district}
                    onChange={(event) =>
                      setHomestayFilters((prev) => ({ ...prev, district: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  City
                  <input
                    value={homestayFilters.city}
                    onChange={(event) =>
                      setHomestayFilters((prev) => ({ ...prev, city: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Town
                  <input
                    value={homestayFilters.town}
                    onChange={(event) =>
                      setHomestayFilters((prev) => ({ ...prev, town: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Village
                  <input
                    value={homestayFilters.village}
                    onChange={(event) =>
                      setHomestayFilters((prev) => ({ ...prev, village: event.target.value }))
                    }
                  />
                </label>
              </div>
              <div className="admin__actions">
                <button className="admin__button" type="button" onClick={handleHomestayFilterApply}>
                  Apply filters
                </button>
                <button className="admin__ghost" type="button" onClick={handleHomestayFilterReset}>
                  Reset
                </button>
              </div>
            </form>
            <form className="admin__form" onSubmit={handleCreateHomestay}>
              <h2 className="admin__subtitle">Create homestay</h2>
              <div className="admin__field">
                <label>Name</label>
                <input
                  value={newHomestay.name}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>Location</label>
                <input
                  value={newHomestay.location}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, location: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>Place name</label>
                <input
                  value={newHomestay.placeName}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, placeName: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>Country</label>
                <input
                  value={newHomestay.country}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, country: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>State</label>
                <input
                  value={newHomestay.state}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, state: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>District</label>
                <input
                  value={newHomestay.district}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, district: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>City</label>
                <input
                  value={newHomestay.city}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, city: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>Town</label>
                <input
                  value={newHomestay.town}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, town: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>Village</label>
                <input
                  value={newHomestay.village}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, village: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>Image URL</label>
                <input
                  value={newHomestay.imageUrl}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, imageUrl: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>Host user ID</label>
                <input
                  type="number"
                  value={newHomestay.hostId}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, hostId: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>Price per night</label>
                <input
                  type="number"
                  value={newHomestay.pricePerNight}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, pricePerNight: event.target.value }))
                  }
                />
              </div>
              <div className="admin__field">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={newHomestay.description}
                  onChange={(event) =>
                    setNewHomestay((prev) => ({ ...prev, description: event.target.value }))
                  }
                />
              </div>
              <button className="admin__button" type="submit">Create homestay</button>
            </form>

            {editingHomestay ? (
              <form className="admin__form" onSubmit={handleUpdateHomestay}>
                <h2 className="admin__subtitle">Edit homestay</h2>
                <div className="admin__field">
                  <label>Name</label>
                  <input
                    value={editingHomestay.name}
                    onChange={(event) =>
                      setEditingHomestay((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__field">
                  <label>Location</label>
                  <input
                    value={editingHomestay.location}
                    onChange={(event) =>
                      setEditingHomestay((prev) => ({ ...prev, location: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__field">
                  <label>Place name</label>
                  <input
                    value={editingHomestay.placeName}
                    onChange={(event) =>
                      setEditingHomestay((prev) => ({ ...prev, placeName: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__field">
                  <label>Country</label>
                  <input
                    value={editingHomestay.country}
                    onChange={(event) =>
                      setEditingHomestay((prev) => ({ ...prev, country: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__field">
                  <label>State</label>
                  <input
                    value={editingHomestay.state}
                    onChange={(event) =>
                      setEditingHomestay((prev) => ({ ...prev, state: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__field">
                  <label>District</label>
                  <input
                    value={editingHomestay.district}
                    onChange={(event) =>
                      setEditingHomestay((prev) => ({ ...prev, district: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__field">
                  <label>City</label>
                  <input
                    value={editingHomestay.city}
                    onChange={(event) =>
                      setEditingHomestay((prev) => ({ ...prev, city: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__field">
                  <label>Town</label>
                  <input
                    value={editingHomestay.town}
                    onChange={(event) =>
                      setEditingHomestay((prev) => ({ ...prev, town: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__field">
                  <label>Village</label>
                  <input
                    value={editingHomestay.village}
                    onChange={(event) =>
                      setEditingHomestay((prev) => ({ ...prev, village: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__field">
                  <label>Image URL</label>
                  <input
                    value={editingHomestay.imageUrl}
                    onChange={(event) =>
                      setEditingHomestay((prev) => ({ ...prev, imageUrl: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__field">
                  <label>Price per night</label>
                  <input
                    type="number"
                    value={editingHomestay.pricePerNight}
                    onChange={(event) =>
                      setEditingHomestay((prev) => ({ ...prev, pricePerNight: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__field">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={editingHomestay.description}
                    onChange={(event) =>
                      setEditingHomestay((prev) => ({ ...prev, description: event.target.value }))
                    }
                  />
                </div>
                <div className="admin__actions">
                  <button className="admin__button" type="submit">Save</button>
                  <button className="admin__ghost" type="button" onClick={() => setEditingHomestay(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}

            <div className="admin__list">
              {homestays.map((homestay) => (
                <div className="admin__row" key={homestay.id}>
                  <div>
                    <strong>{homestay.name}</strong>
                    <div className="admin__meta">
                      {homestay.location} · ${homestay.pricePerNight}
                    </div>
                  </div>
                  <div className="admin__actions">
                    <button className="admin__ghost" type="button" onClick={() => handleStartEditHomestay(homestay)}>
                      Edit
                    </button>
                    <button className="admin__ghost" type="button" onClick={() => handleDeleteHomestay(homestay.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'bookings' ? (
          <div className="admin__section">
            <div className="admin__list">
              {bookings.map((booking) => (
                <div className="admin__row" key={booking.id}>
                  <div>
                    <strong>Booking #{booking.id}</strong>
                    <div className="admin__meta">Status: {booking.status}</div>
                  </div>
                  <div className="admin__actions">
                    <select
                      value={booking.status}
                      onChange={(event) => handleBookingStatusChange(booking.id, event.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button className="admin__ghost" type="button" onClick={() => handleDeleteBooking(booking.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'chats' ? (
          <div className="admin__section">
            <div className="admin__list">
              {chats.map((chat) => (
                <div className="admin__row" key={chat.id}>
                  <div>
                    <strong>Message #{chat.id} from {chat.username}</strong>
                    <div className="admin__meta">{chat.content}</div>
                  </div>
                  <button className="admin__ghost" type="button" onClick={() => handleDeleteChat(chat.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'homepage' ? (
          <div className="admin__section">
            <form className="admin__form" onSubmit={handleHomepageSave}>
              <h2 className="admin__subtitle">Homepage content</h2>
              <div className="admin__grid">
                <label className="admin__field">
                  Hero eyebrow
                  <input
                    value={homepage.heroEyebrow}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, heroEyebrow: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Hero title
                  <input
                    value={homepage.heroTitle}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, heroTitle: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--full">
                  Hero subtitle
                  <textarea
                    rows="3"
                    value={homepage.heroSubtitle}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, heroSubtitle: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Primary CTA
                  <input
                    value={homepage.heroCtaPrimary}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, heroCtaPrimary: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Secondary CTA
                  <input
                    value={homepage.heroCtaSecondary}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, heroCtaSecondary: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Stat 1 label
                  <input
                    value={homepage.stat1Label}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, stat1Label: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Stat 2 label
                  <input
                    value={homepage.stat2Label}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, stat2Label: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Stat 3 label
                  <input
                    value={homepage.stat3Label}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, stat3Label: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Tile 1 title
                  <input
                    value={homepage.tile1Title}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, tile1Title: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--full">
                  Tile 1 description
                  <textarea
                    rows="2"
                    value={homepage.tile1Description}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, tile1Description: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--toggle">
                  <input
                    type="checkbox"
                    checked={homepage.tile1Visible}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, tile1Visible: event.target.checked }))
                    }
                  />
                  Show tile 1
                </label>
                <label className="admin__field">
                  Tile 2 title
                  <input
                    value={homepage.tile2Title}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, tile2Title: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--full">
                  Tile 2 description
                  <textarea
                    rows="2"
                    value={homepage.tile2Description}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, tile2Description: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--toggle">
                  <input
                    type="checkbox"
                    checked={homepage.tile2Visible}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, tile2Visible: event.target.checked }))
                    }
                  />
                  Show tile 2
                </label>
                <label className="admin__field">
                  Tile 3 title
                  <input
                    value={homepage.tile3Title}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, tile3Title: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--full">
                  Tile 3 description
                  <textarea
                    rows="2"
                    value={homepage.tile3Description}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, tile3Description: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--toggle">
                  <input
                    type="checkbox"
                    checked={homepage.tile3Visible}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, tile3Visible: event.target.checked }))
                    }
                  />
                  Show tile 3
                </label>
                <label className="admin__field">
                  Flow title
                  <input
                    value={homepage.flowTitle}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, flowTitle: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--full">
                  Flow subtitle
                  <textarea
                    rows="2"
                    value={homepage.flowSubtitle}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, flowSubtitle: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--toggle">
                  <input
                    type="checkbox"
                    checked={homepage.flowVisible}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, flowVisible: event.target.checked }))
                    }
                  />
                  Show flow section
                </label>
                <label className="admin__field">
                  Step 1 title
                  <input
                    value={homepage.step1Title}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, step1Title: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--full">
                  Step 1 description
                  <textarea
                    rows="2"
                    value={homepage.step1Description}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, step1Description: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--toggle">
                  <input
                    type="checkbox"
                    checked={homepage.step1Visible}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, step1Visible: event.target.checked }))
                    }
                  />
                  Show step 1
                </label>
                <label className="admin__field">
                  Step 2 title
                  <input
                    value={homepage.step2Title}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, step2Title: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--full">
                  Step 2 description
                  <textarea
                    rows="2"
                    value={homepage.step2Description}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, step2Description: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--toggle">
                  <input
                    type="checkbox"
                    checked={homepage.step2Visible}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, step2Visible: event.target.checked }))
                    }
                  />
                  Show step 2
                </label>
                <label className="admin__field">
                  Step 3 title
                  <input
                    value={homepage.step3Title}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, step3Title: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--full">
                  Step 3 description
                                  <label className="admin__field admin__field--toggle">
                                    <input
                                      type="checkbox"
                                      checked={homepage.step3Visible}
                                      onChange={(event) =>
                                        setHomepage((prev) => ({ ...prev, step3Visible: event.target.checked }))
                                      }
                                    />
                                    Show step 3
                                  </label>
                  <textarea
                    rows="2"
                    value={homepage.step3Description}
                    onChange={(event) =>
                      setHomepage((prev) => ({ ...prev, step3Description: event.target.value }))
                    }
                  />
                </label>
              </div>
              <div className="admin__actions">
                <button className="admin__button" type="submit">Save homepage</button>
              </div>
              {homepageStatus ? <p className="admin__status">{homepageStatus}</p> : null}
            </form>
            <form className="admin__form" onSubmit={handleContainerCreate}>
              <h2 className="admin__subtitle">Homepage containers</h2>
              <div className="admin__grid">
                <label className="admin__field">
                  Title
                  <input
                    value={containerForm.title}
                    onChange={(event) =>
                      setContainerForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--full">
                  Description
                  <textarea
                    rows="2"
                    value={containerForm.description}
                    onChange={(event) =>
                      setContainerForm((prev) => ({ ...prev, description: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Metric
                  <select
                    value={containerForm.metricKey}
                    onChange={(event) =>
                      setContainerForm((prev) => ({ ...prev, metricKey: event.target.value }))
                    }
                  >
                    <option value="">None</option>
                    <option value="CITY_COUNT">Places count</option>
                    <option value="HOMESTAY_COUNT">Homestay count</option>
                    <option value="BOOKING_COUNT">Booking count</option>
                  </select>
                </label>
                <label className="admin__field">
                  Sort order
                  <input
                    type="number"
                    value={containerForm.sortOrder}
                    onChange={(event) =>
                      setContainerForm((prev) => ({ ...prev, sortOrder: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--toggle">
                  <input
                    type="checkbox"
                    checked={containerForm.visible}
                    onChange={(event) =>
                      setContainerForm((prev) => ({ ...prev, visible: event.target.checked }))
                    }
                  />
                  Show container
                </label>
              </div>
              <div className="admin__actions">
                <button className="admin__button" type="submit">Add container</button>
              </div>
              {containerStatus ? <p className="admin__status">{containerStatus}</p> : null}
            </form>

            <div className="admin__list">
              {homepageContainers.map((container) => (
                <div className="admin__row" key={container.id}>
                  <div className="admin__container-fields">
                    <input
                      value={container.title || ''}
                      onChange={(event) =>
                        setHomepageContainers((prev) =>
                          prev.map((item) =>
                            item.id === container.id
                              ? { ...item, title: event.target.value }
                              : item
                          )
                        )
                      }
                    />
                    <textarea
                      rows="2"
                      value={container.description || ''}
                      onChange={(event) =>
                        setHomepageContainers((prev) =>
                          prev.map((item) =>
                            item.id === container.id
                              ? { ...item, description: event.target.value }
                              : item
                          )
                        )
                      }
                    />
                    <div className="admin__container-meta">
                      <select
                        value={container.metricKey || ''}
                        onChange={(event) =>
                          setHomepageContainers((prev) =>
                            prev.map((item) =>
                              item.id === container.id
                                ? { ...item, metricKey: event.target.value || null }
                                : item
                            )
                          )
                        }
                      >
                        <option value="">None</option>
                        <option value="CITY_COUNT">Places count</option>
                        <option value="HOMESTAY_COUNT">Homestay count</option>
                        <option value="BOOKING_COUNT">Booking count</option>
                      </select>
                      <input
                        type="number"
                        value={container.sortOrder ?? 0}
                        onChange={(event) =>
                          setHomepageContainers((prev) =>
                            prev.map((item) =>
                              item.id === container.id
                                ? { ...item, sortOrder: event.target.value }
                                : item
                            )
                          )
                        }
                      />
                      <label className="admin__container-toggle">
                        <input
                          type="checkbox"
                          checked={Boolean(container.visible)}
                          onChange={(event) =>
                            setHomepageContainers((prev) =>
                              prev.map((item) =>
                                item.id === container.id
                                  ? { ...item, visible: event.target.checked }
                                  : item
                              )
                            )
                          }
                        />
                        Visible
                      </label>
                    </div>
                  </div>
                  <div className="admin__actions">
                    <button
                      className="admin__button"
                      type="button"
                      onClick={() =>
                        handleContainerUpdate(container.id, {
                          title: container.title,
                          description: container.description,
                          metricKey: container.metricKey || null,
                          sortOrder: Number(container.sortOrder) || 0,
                          visible: Boolean(container.visible),
                        })
                      }
                    >
                      Save
                    </button>
                    <button
                      className="admin__ghost"
                      type="button"
                      onClick={() => handleContainerDelete(container.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'about' ? (
          <div className="admin__section">
            <form className="admin__form" onSubmit={handleAboutCreate}>
              <h2 className="admin__subtitle">About page team</h2>
              <div className="admin__grid">
                <label className="admin__field">
                  Name
                  <input
                    value={aboutForm.name}
                    onChange={(event) =>
                      setAboutForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Role
                  <input
                    value={aboutForm.role}
                    onChange={(event) =>
                      setAboutForm((prev) => ({ ...prev, role: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--full">
                  Bio
                  <textarea
                    rows="3"
                    value={aboutForm.bio}
                    onChange={(event) =>
                      setAboutForm((prev) => ({ ...prev, bio: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Image URL
                  <input
                    value={aboutForm.imageUrl}
                    onChange={(event) =>
                      setAboutForm((prev) => ({ ...prev, imageUrl: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field">
                  Sort order
                  <input
                    type="number"
                    value={aboutForm.sortOrder}
                    onChange={(event) =>
                      setAboutForm((prev) => ({ ...prev, sortOrder: event.target.value }))
                    }
                  />
                </label>
                <label className="admin__field admin__field--toggle">
                  <input
                    type="checkbox"
                    checked={aboutForm.visible}
                    onChange={(event) =>
                      setAboutForm((prev) => ({ ...prev, visible: event.target.checked }))
                    }
                  />
                  Show person
                </label>
              </div>

              <div className="admin__stack">
                <div className="admin__inline">
                  <h3 className="admin__subtitle admin__subtitle--small">Info entries</h3>
                  <button className="admin__ghost" type="button" onClick={handleFormInfoAdd}>
                    Add info
                  </button>
                </div>
                {aboutForm.infoEntries.length ? (
                  <div className="admin__stack">
                    {aboutForm.infoEntries.map((entry, index) => (
                      <div className="admin__inline" key={`about-info-${index}`}>
                        <input
                          placeholder="Label"
                          value={entry.label}
                          onChange={(event) =>
                            handleFormInfoChange(index, 'label', event.target.value)
                          }
                        />
                        <input
                          placeholder="Value"
                          value={entry.value}
                          onChange={(event) =>
                            handleFormInfoChange(index, 'value', event.target.value)
                          }
                        />
                        <button
                          className="admin__ghost"
                          type="button"
                          onClick={() => handleFormInfoRemove(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="admin__meta">No info entries yet.</p>
                )}
              </div>

              <div className="admin__stack">
                <div className="admin__inline">
                  <h3 className="admin__subtitle admin__subtitle--small">Links</h3>
                  <button className="admin__ghost" type="button" onClick={handleFormLinkAdd}>
                    Add link
                  </button>
                </div>
                {aboutForm.links.length ? (
                  <div className="admin__stack">
                    {aboutForm.links.map((entry, index) => (
                      <div className="admin__inline" key={`about-link-${index}`}>
                        <input
                          placeholder="Label"
                          value={entry.label}
                          onChange={(event) =>
                            handleFormLinkChange(index, 'label', event.target.value)
                          }
                        />
                        <input
                          placeholder="URL"
                          value={entry.url}
                          onChange={(event) =>
                            handleFormLinkChange(index, 'url', event.target.value)
                          }
                        />
                        <button
                          className="admin__ghost"
                          type="button"
                          onClick={() => handleFormLinkRemove(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="admin__meta">No links yet.</p>
                )}
              </div>

              <div className="admin__actions">
                <button className="admin__button" type="submit">Add person</button>
              </div>
              {aboutStatus ? <p className="admin__status">{aboutStatus}</p> : null}
            </form>

            <div className="admin__list">
              {aboutPeople.map((person) => (
                <div className="admin__row" key={person.id}>
                  <div className="admin__container-fields">
                    <input
                      value={person.name || ''}
                      onChange={(event) =>
                        setAboutPeople((prev) =>
                          prev.map((item) =>
                            item.id === person.id
                              ? { ...item, name: event.target.value }
                              : item
                          )
                        )
                      }
                    />
                    <input
                      value={person.role || ''}
                      onChange={(event) =>
                        setAboutPeople((prev) =>
                          prev.map((item) =>
                            item.id === person.id
                              ? { ...item, role: event.target.value }
                              : item
                          )
                        )
                      }
                    />
                    <textarea
                      rows="2"
                      value={person.bio || ''}
                      onChange={(event) =>
                        setAboutPeople((prev) =>
                          prev.map((item) =>
                            item.id === person.id
                              ? { ...item, bio: event.target.value }
                              : item
                          )
                        )
                      }
                    />
                    <input
                      value={person.imageUrl || ''}
                      onChange={(event) =>
                        setAboutPeople((prev) =>
                          prev.map((item) =>
                            item.id === person.id
                              ? { ...item, imageUrl: event.target.value }
                              : item
                          )
                        )
                      }
                    />

                    <div className="admin__stack">
                      <div className="admin__inline">
                        <span className="admin__meta">Info entries</span>
                        <button
                          className="admin__ghost"
                          type="button"
                          onClick={() => handlePersonInfoAdd(person.id)}
                        >
                          Add info
                        </button>
                      </div>
                      {(person.infoEntries || []).map((entry, index) => (
                        <div className="admin__inline" key={`person-info-${person.id}-${index}`}>
                          <input
                            placeholder="Label"
                            value={entry.label || ''}
                            onChange={(event) =>
                              handlePersonInfoChange(person.id, index, 'label', event.target.value)
                            }
                          />
                          <input
                            placeholder="Value"
                            value={entry.value || ''}
                            onChange={(event) =>
                              handlePersonInfoChange(person.id, index, 'value', event.target.value)
                            }
                          />
                          <button
                            className="admin__ghost"
                            type="button"
                            onClick={() => handlePersonInfoRemove(person.id, index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="admin__stack">
                      <div className="admin__inline">
                        <span className="admin__meta">Links</span>
                        <button
                          className="admin__ghost"
                          type="button"
                          onClick={() => handlePersonLinkAdd(person.id)}
                        >
                          Add link
                        </button>
                      </div>
                      {(person.links || []).map((entry, index) => (
                        <div className="admin__inline" key={`person-link-${person.id}-${index}`}>
                          <input
                            placeholder="Label"
                            value={entry.label || ''}
                            onChange={(event) =>
                              handlePersonLinkChange(person.id, index, 'label', event.target.value)
                            }
                          />
                          <input
                            placeholder="URL"
                            value={entry.url || ''}
                            onChange={(event) =>
                              handlePersonLinkChange(person.id, index, 'url', event.target.value)
                            }
                          />
                          <button
                            className="admin__ghost"
                            type="button"
                            onClick={() => handlePersonLinkRemove(person.id, index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="admin__container-meta">
                      <input
                        type="number"
                        value={person.sortOrder ?? 0}
                        onChange={(event) =>
                          setAboutPeople((prev) =>
                            prev.map((item) =>
                              item.id === person.id
                                ? { ...item, sortOrder: event.target.value }
                                : item
                            )
                          )
                        }
                      />
                      <label className="admin__container-toggle">
                        <input
                          type="checkbox"
                          checked={Boolean(person.visible)}
                          onChange={(event) =>
                            setAboutPeople((prev) =>
                              prev.map((item) =>
                                item.id === person.id
                                  ? { ...item, visible: event.target.checked }
                                  : item
                              )
                            )
                          }
                        />
                        Visible
                      </label>
                    </div>
                  </div>
                  <div className="admin__actions">
                    <button
                      className="admin__button"
                      type="button"
                      onClick={() => handleAboutUpdate(person)}
                    >
                      Save
                    </button>
                    <button
                      className="admin__ghost"
                      type="button"
                      onClick={() => handleAboutDelete(person.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default AdminDashboard
