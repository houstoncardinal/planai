# Collaboration Features Setup Guide

## Database Migration Required

A new migration file has been created at:
`supabase/migrations/20251018171630_add_collaboration_features.sql`

### To Apply the Migration:

1. **Via Supabase Dashboard** (Recommended):
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy the contents of the migration file
   - Run the SQL commands
   - This will add all necessary columns and tables

2. **Via Supabase CLI** (If linked):
   ```bash
   supabase link --project-ref your-project-ref
   supabase db push
   ```

## What the Migration Adds:

### New Columns to `projects` table:
- `payment_method` - Payment method for the project
- `time_tracking` - JSONB field for tracking hours per user
- `due_date` - Project due date
- `budget` - Project budget
- `time_spent` - Total time spent on project
- `estimated_completion` - Estimated completion time
- `steps_completed` - Number of completed steps
- `total_steps` - Total number of steps
- `owner_id` - Original owner of the project

### New `project_collaborators` table:
- Manages project sharing and collaboration
- Tracks user roles (viewer, editor, admin)
- Invitation status (pending, accepted, declined)
- Timestamps for invitations and acceptances

### Updated RLS Policies:
- Users can now view projects they own OR projects shared with them
- Editors and admins can update shared projects
- Only owners can delete projects
- Owners can invite collaborators

## Features Now Available:

### 1. **Project Creation** ✅
- Create projects with all fields (title, description, category, priority, status)
- Add technologies and team members
- Set budget and payment method
- Track time per user
- Set due dates and estimated completion

### 2. **Collaboration** (Ready to implement):
- Share projects with other users
- Assign roles: Viewer, Editor, or Admin
- Track who invited whom
- Accept/decline invitations
- View shared projects with special labels

### 3. **Shared Project Indicators**:
Projects shared with you will show:
- "Shared by [User Email]" badge
- Different visual styling
- Role indicator (Viewer/Editor/Admin)

## How to Use Collaboration (After Migration):

### Invite a Collaborator:
```typescript
const { error } = await supabase
  .from('project_collaborators')
  .insert({
    project_id: projectId,
    user_id: collaboratorUserId,
    role: 'editor', // or 'viewer', 'admin'
    invited_by: currentUserId,
    status: 'pending'
  });
```

### Accept an Invitation:
```typescript
const { error } = await supabase
  .from('project_collaborators')
  .update({
    status: 'accepted',
    accepted_at: new Date().toISOString()
  })
  .eq('project_id', projectId)
  .eq('user_id', currentUserId);
```

### View Shared Projects:
The updated RLS policies automatically include shared projects in queries:
```typescript
const { data } = await supabase
  .from('projects')
  .select('*');
// Returns both owned and shared projects
```

### Check if Project is Shared:
```typescript
const { data } = await supabase
  .from('projects_with_collaborators')
  .select('*, is_shared, collaborators')
  .eq('id', projectId)
  .single();

if (data.is_shared) {
  // Show "Shared with you" badge
  // Display collaborator info
}
```

## Next Steps:

1. **Apply the migration** using one of the methods above
2. **Test project creation** - should now work without errors
3. **Implement collaboration UI** - add invite/share buttons
4. **Add shared project badges** - visual indicators for shared projects
5. **Test with multiple users** - verify permissions work correctly

## Troubleshooting:

### If project creation still fails:
1. Check if migration was applied successfully
2. Verify all columns exist in the database
3. Check browser console for specific error messages
4. Ensure user is authenticated

### If collaboration doesn't work:
1. Verify RLS policies are active
2. Check that both users exist in auth.users
3. Ensure project_collaborators table was created
4. Test with simple SELECT queries first

## Security Notes:

- All tables have Row Level Security (RLS) enabled
- Users can only see their own projects and projects shared with them
- Only project owners can invite collaborators
- Only project owners can delete projects
- Editors can modify project content but not delete
- Viewers can only read project information
