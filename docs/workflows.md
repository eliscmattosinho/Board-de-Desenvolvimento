# System workflows

## 1. Card projection workflow (The Lens Flow)

This workflow explains how a card is dynamically displayed when switching boards:

1. **Selection:** User selects a `targetBoardId` (e.g., switching from Kanban to Scrum).
2. **Mapping:** `boardProjection.js` triggers `buildColumnMirror`.
3. **Semantic search:** It looks for an `explicitColumnMirrorMap`. If not found, it performs a **semantic match** by `status` (e.g., `status: "todo"` finds the first column with that status).
4. **Resolution:** `resolveBoardCards` filters the global card list and maps them into a "Displayable" array for the UI, adding `displayColumnId` and `displayStatus`.

## 2. Board deletion & Cascading cleanup

To maintain a clean state, deletion follows a strict protocol to prevent "ghost" data:

1. `deleteBoard(id)` is called via `boardActions.js`.
2. **Scope resolution:** - Board without `groupId`: Only the active board is affected.
   - Board with `groupId`: All boards in the same group are affected.
3. **Card cleanup:** `clearCards(boardId)` is triggered for every affected board to remove cards physically assigned to them.
4. **Column cleanup:** `removeColumn(boardId, colId)` is called for every column belonging to those boards to prevent memory leaks in `ColumnContext`.

## 3. New card creation

1. **User action:** The user clicks the "Add" icon in a specific column.
2. **Context capture:** The system identifies the `activeBoard` and the `targetColumn.status`.
3. **Data generation:** `addCard` creates the card with the `boardId` of the current view and the `status` inherited from the column.
4. **Auto-projection:** Because the `status` is saved, this card will automatically mirror correctly if the user switches to any other board with a compatible status column.

## 4. Reload and Storage reset workflow

The system implements a **Clean-Slate on reload** policy to ensure application stability and state reset:

1. **Reload detection:** The `resetStorageOnReload` utility monitors the navigation type via `window.performance`.
2. **Storage filtering:** If a "reload" is detected, the system forces a purge:
    - `sessionStorage` is entirely cleared.
    - `localStorage` is wiped, **except** for keys in the `WHITELIST` (e.g., `theme`).
3. **State re-hydration:** Because the storage is cleared before the app initializes, the system will always re-load the original `boardTemplates.js` as the fresh source of truth upon every page refresh.

## 5. Anti-patterns avoided

- ❌ Column attempting to project or mirror a card.
- ❌ Card knowing about other boards or templates.
- ❌ Mirroring logic embedded inside a Reducer.
- ❌ Persisting `displayColumnId` (visual state) inside the Card object (real state).

<br />

**[<- Go back to Tech Docs](../README.md#️-technologies-used)**
