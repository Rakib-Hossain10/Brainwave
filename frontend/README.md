README

Welcome! This repo is a small “character-chat” app that lets users:

browse a gallery of AI characters,

configure a character (overview/skills/tags),

edit a simple branching story graph,

start a chat with the selected character.

The app is built with React + Vite + Tailwind and a tiny Zustand store for state.

1) Quick start
# 1) install deps
npm i

# 2) start dev server
npm run dev
# → http://localhost:5173


If you see an error about lucide-react icons during dev, install it:
npm i lucide-react (only used for a few icons).

2) What’s in here (high level)
src/
  pages/
    HomePage.jsx            ← shows gallery OR chat, depending on selection
    ChatContainerPage.jsx   ← chat screen (header + messages + input)
    CharacterEditorPage.jsx ← wrapper page for CharacterEditor
    StoryEditor.jsx         ← node/edge graph editor (saves per-character)
  components/HomePage/
    MainContent.jsx         ← character cards & “Configure” navigation
    CharacterPage.jsx       ← thin wrapper around MainContent
  components/CharacterEditor/
    CharacterEditor.jsx     ← tabs: Overview / Skills / Tags + Start Chat
    OverviewPanel.jsx
    SkillsPanel.jsx
    TagsPanel.jsx
    modals/…                ← add/edit stat/skill/tag dialogs
  store/
     useChatStore.js     ← Zustand store (characters, selection, etc.)
    useAuthStore.js      ← Zustand store  (for user authintication)
    useSearchStore.js   


3) Core flow (how pages connect)
Browse → Configure

On Home, MainContent renders character cards.
Clicking Configure navigates to /characters/:id and also persists the last open character id so it survives navigation/refreshes.

Character Editor

CharacterEditor reads the selected character (from store) and also restores it if needed using the id persisted above. The page exposes tabs (Overview, Skills, Tags), supports optimistic edits, and has a Start Chat button.

Start Chat

When Start Chat is pressed, we make sure the current character id is saved and navigate to /home. HomePage will render the chat when a character is selected.

Why /home? This app doesn’t route to /chat/:id. Instead, HomePage conditionally shows the chat area when a selectedCharacter exists in the store.

4) State & persistence

characters: fetched into the store and used across pages.

selectedCharacter: drives whether Home shows the gallery or the chat.

lastCharacterId: saved in localStorage by MainContent and reused by CharacterEditor so your selection sticks across navigations/refreshes (especially after returning from Story Editor).

A short-lived sessionStorage flag (skipClearSelectionOnce) is used when leaving the editor to avoid clearing the selection right before going back to /home to chat.

5) Important files you’ll touch first

HomePage.jsx – the top-level switch: gallery vs chat.
If selectedCharacter exists → render ChatContainerPage, otherwise show header + gallery.

MainContent.jsx – character grid & cards.

“Configure” → push /characters/:id and remember lastCharacterId.
Also sets selectedCharacter when a card is clicked.

Contains a minimal “Show more” modal for long descriptions.

CharacterEditor.jsx – the editor UX.

Restores selection by routeId or lastCharacterId.

Tabs for Overview / Skills / Tags; optimistic add/edit handlers.

“Start Chat” → save id and go /home.

CharacterPage.jsx – just renders MainContent.

There are a couple of earlier versions of MainContent.jsx in the repo history/copies. The current one you should reference is the version that persists lastCharacterId before navigating.

6) Story Editor (graph)

The Story Editor is a canvas UI that lets you add nodes and connect them with edges (branching).

It stores the graph per character (localStorage while offline; replace with your backend endpoint later).

From Character Editor there’s a “Story Editor →” button to open it; after saving you go back to the same character and can Start Chat.

If you wire a backend later, save/load at /api/stories/:characterId/graph with a payload like:

{
  "nodes":[{"id":"root","x":120,"y":80,"title":"1. root","content":"..."}],
  "edges":[{"id":"e-root-start1","source":"root","target":"start-1"}]
}

7) Dependencies

These are the main libraries you’ll see used in code:

react, react-dom, vite – app + dev server

react-router-dom – navigation (/home, /characters/:id, /story/:id)

zustand – simple global store (useChatStore)

tailwindcss, postcss, autoprefixer – styling

lucide-react (optional) – icons; if you see a build error, install with npm i lucide-react

(optional) Live2D – if you enable the companion character overlay:

pixi.js, pixi-live2d-display

add the Cubism runtime (live2dcubismcore.js) via a <script> tag in index.html

The gallery/cards, editor pages, and conditional home routing are evident in the referenced files.

8) Environment variables

No required env vars for local dev.
When you add the backend, introduce:



Then replace the localStorage read/write in the Story Editor / Character Editor with fetch(${VITE_API_BASE_URL}/api/...).

9) Build
npm run build   # Vite production build
npm run preview # serve the build locally

10) Conventions & tips

Routing

Stay on /home for chat. Don’t create /chat/:id; HomePage chooses chat vs gallery by selectedCharacter.

For editor pages, keep /characters/:id so a refresh restores context.

Persistence

Always update both the store and localStorage.lastCharacterId when you switch characters or click Configure. That guarantees the selection survives coming back from the Story Editor or a refresh.

Optimistic updates

All edits in the editor are applied to the store immediately; when you add a backend, send the same payload and update the store only on success if you prefer strict consistency. (See the replaceCharacterInStore helper inside the editor.)

UI

Tailwind is used throughout. The gallery cards are intentionally fixed height (clamped text) and open a modal for full content so the grid doesn’t reflow.

11) Where to add things next

Backend wiring

Characters CRUD: hydrate the Zustand store from your API.

Story Graph: replace localStorage read/write with API at /api/stories/:characterId/graph.

Live2D overlay (optional)

Install pixi.js + pixi-live2d-display.

Put live2dcubismcore.js in public/ and load with <script src="/live2dcubismcore.js"></script> in index.html.

Render your <Live2DDisplay /> component in ChatContainerPage with pointer-events: none and a transparent canvas so it doesn’t block text.

12) FAQ

Why do I go back to Home to start chat?
Because Home decides to show the chat when a character is selected. The Start Chat button just ensures the selection is saved and returns you there.

After the Story Editor my selection resets
That’s why we persist lastCharacterId in localStorage and restore on mount in the editor. If you add server auth, you can store it server-side too.
