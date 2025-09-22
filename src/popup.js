const $ = (id) => document.getElementById(id)

let editingId = null

function nowISO() {
    return new Date().toISOString()
}

async function getIdeas() {
    return new Promise((resolve) => {
        chrome.storage.local.get({ ideas: [] }, (res) =>
            resolve(res.ideas || [])
        )
    })
}

async function saveIdeas(ideas) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ ideas }, () => resolve())
    })
}

async function saveIdea() {
    const title = $('title').value.trim()
    const content = $('content').value.trim()
    const tags = $('tags')
        .value.split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    if (!content && !title) return alert('Write something first')

    const ideas = await getIdeas()
    if (editingId) {
        const idx = ideas.findIndex((i) => i.id === editingId)
        if (idx > -1) {
            ideas[idx].title = title
            ideas[idx].content = content
            ideas[idx].tags = tags
            ideas[idx].updatedAt = nowISO()
        }
        editingId = null
    } else {
        const idea = {
            id: 'id_' + Date.now(),
            title,
            content,
            tags,
            createdAt: nowISO(),
            updatedAt: nowISO(),
        }
        ideas.push(idea)
    }
    await saveIdeas(ideas)
    clearEditor()
    renderList()
}

function clearEditor() {
    $('title').value = ''
    $('content').value = ''
    $('tags').value = ''
    $('save').textContent = 'Save Idea'
    editingId = null
}

async function deleteIdea(id) {
    if (!confirm('Delete this idea?')) return
}

const form = $('save-from')
form.addEventListener('submit', async (e) => {
    e.preventDefault() // Prevent form from refreshing the page

    // Capture form data
    const formData = new FormData(form)
    const entries = formData.entries()
    const title = formData.get('title')
    const content = formData.get('content')
    const tags = formData.get('tags')

    saveIdea()

    form.reset()
})
