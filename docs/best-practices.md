# Development Standards & Best Practices

## 1. Context API & Aware Hooks (Smart Hooks)

**The Golden Rule:**
> "If a component needs data from a Context, it must ask the Context directly via a hook, instead of waiting for a parent to pass it down."

* **Direct access:** Components follow the "Rule of Truth". Use `useBoardContext()`, `useCardsContext()`, or `useColumnsContext()`. Avoid **prop drilling** to keep components decoupled.
* **Logic separation:** Contexts hold state and providers. Business logic resides in `Actions` (`cardActions.js`) or specialized `Hooks` (`useBoardLogic.js`, `useBoardUI.js`).

## 2. State immutability & Persistence

* **Reducers:** All state changes must go through a Reducer (e.g., `cardReducer.js`, `boardReducer.js`) to ensure predictable, traceable transitions.
* **Persistence layer:** Every reducer is responsible for calling its respective service (e.g., `saveCards`) to sync the state with `sessionStorage` on every action, ensuring no data loss during the user session.

## 3. Performance & memoization

* **Optimization:** High-frequency components (`Column`, `CardItem`, `BoardSection`) use `React.memo` to prevent unnecessary re-renders.
* **Reference stability:** Use `useCallback` and `useMemo` for any function or object passed into Context Providers to keep the tree performant.

## 4. Defensive programming & Normalization

* **Data sanitization:** Always use `normalizeText()` or `normalizeId()` when comparing card statuses or creating IDs to prevent bugs caused by casing.
* **Limbo prevention:** `resolveBoardCards` must validate the `displayColumnId` against the **live state** of columns before rendering.
* **Fail-Safe initializers:** Providers check for existing data in storage before loading default templates.

## 5. UI/UX decoupling

* **Domain purity:** Domain logic (`boardProjection.js`) must remain pure (no knowledge of CSS or Modals).
* **UI coordination:** `useBoardLogic.js` orchestrates the interaction between domain logic and the UI (modals, clicks, hover states).

## 6. Maintenance responsibility matrix

| Problem | Target domain |
| --- | --- |
| Where a card appears (Visibility) | **Board** |
| Visual/Style of the column | **Column** |
| Data persistence (storage) | **Card** |
| Synchronization/Mirroring rules | **Board** |
| Drag & Drop execution | **Board -> Card** |

<br />

**[<- Go back to Tech Docs](../README.md#️-technologies-used)**
