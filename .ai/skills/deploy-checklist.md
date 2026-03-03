# Deploy Today's Checklist Skill

## Description
Updates the dev checklist with new tasks and deploys to production.

## Triggers
When user sends "here's todays checklist" or similar with a list of tasks.

## Actions

1. **Parse Tasks**: Extract task items from user message (each line or comma-separated item becomes a task)

2. **Update Checklist File**: Edit `src/app/todays-dev-checklist/page.tsx` to replace `defaultTasks` array:
   ```typescript
   const defaultTasks = [
     { id: 1, text: "task 1", completed: false },
     { id: 2, text: "task 2", completed: false },
     // ... parsed from user message
   ];
   ```

3. **Commit Changes**:
   ```bash
   git add src/app/todays-dev-checklist/page.tsx
   git commit -m "Update today's dev checklist"
   git push
   ```

## Example User Message
"here's todays checklist: morning code session, review prs, write docs, run tests"

## Notes
- Keep tasks simple (short text)
- Set all tasks to `completed: false`
- Use sequential IDs starting from 1
