# Permission System Testing Guide

## Current Status ✅
- ✅ Permission system fully implemented
- ✅ NUTRITIONIST role permissions refined
- ✅ Sidebar permission filtering active
- ✅ API security with permission validation
- ✅ Page-level guards implemented
- ✅ No compilation errors

## Test Accounts

### NUTRITIONIST Account
```
Email: sari.nutrition@sppg.com
Expected Role: NUTRITIONIST
```

## Expected Behavior for NUTRITIONIST

### ✅ SHOULD SEE (Accessible Menus):
1. **Dashboard** → Basic Dashboard
2. **Menu Planning** → Menu Planning, Recipes, Create Recipe
3. **Quality Management** → Quality Checks, Food Samples, Quality Standards, Nutrition Consultations  
4. **Students** → Students (for meal planning context)
5. **Reports & Analytics** → Reports, Analytics
6. **Feedback** → Feedback

### ❌ SHOULD NOT SEE (Hidden Menus):
- Schools
- Raw Materials  
- Suppliers
- Purchase Orders
- Inventory
- Production (all sub-menus)
- Distribution (all sub-menus)
- Drivers
- Vehicles
- Waste Management
- Financial
- Users/Roles/Admin

## Testing Steps

### 1. Login Test
```
1. Open: http://localhost:3000
2. Login with: sari.nutrition@sppg.com
3. Verify successful authentication
4. Check if redirected to appropriate dashboard
```

### 2. Sidebar Visibility Test
```
1. After login, check left sidebar
2. Count visible menu items
3. Verify only expected menus are visible
4. Verify hidden menus are not present
```

### 3. Direct URL Access Test
```
Try accessing these URLs directly (should be blocked):
- http://localhost:3000/dashboard/inventory
- http://localhost:3000/dashboard/suppliers  
- http://localhost:3000/dashboard/purchase-orders
- http://localhost:3000/dashboard/production
- http://localhost:3000/dashboard/financial
- http://localhost:3000/dashboard/users
```

### 4. Functional Access Test
```
Try accessing these URLs (should work):
- http://localhost:3000/dashboard/menu-planning
- http://localhost:3000/dashboard/recipes
- http://localhost:3000/dashboard/quality-checks
- http://localhost:3000/dashboard/nutrition-consultations
- http://localhost:3000/dashboard/students
```

## Debugging Commands

### Check Session Data
```javascript
// In browser console
console.log('Session:', window.next?.router?.events)
// Or check Network tab for session API calls
```

### Check User Roles
```javascript
// Look for session data in browser dev tools
// Application → Local Storage → Check for session tokens
```

### Server Logs
```bash
# Check terminal running npm run dev for any permission errors
# Look for authentication/authorization related logs
```

## Quick Verification Checklist

- [ ] App runs without errors on http://localhost:3000
- [ ] Can login with sari.nutrition@sppg.com  
- [ ] Sidebar shows only 6 main sections for NUTRITIONIST
- [ ] Can access /dashboard/menu-planning
- [ ] Can access /dashboard/recipes
- [ ] Can access /dashboard/nutrition-consultations
- [ ] Cannot access /dashboard/inventory (redirects or shows error)
- [ ] Cannot access /dashboard/suppliers (redirects or shows error)
- [ ] Cannot access /dashboard/production (redirects or shows error)

## Troubleshooting

### If All Menus Still Visible:
1. Check if user role is correctly assigned in database
2. Verify session contains correct role data
3. Check browser console for JavaScript errors
4. Clear browser cache/localStorage
5. Check if permission mapping is correct

### If No Menus Visible:
1. Check if user is authenticated
2. Verify permission definitions include NUTRITIONIST
3. Check if session data is loading correctly
4. Look for permission check failures in console

### If Specific Features Don't Work:
1. Check individual component PermissionGuard implementations
2. Verify API route permission validation
3. Check for TypeScript compilation errors
4. Review permission string matches exactly

## Expected Permission Counts

**NUTRITIONIST should have access to approximately:**
- 12-15 specific permissions (instead of 40+ for ADMIN)
- 6 main menu sections (instead of 15+ for ADMIN)
- Core nutrition functionality only

## Files Modified
- `/src/lib/permissions.ts` - Permission definitions
- `/src/components/layout/sidebar.tsx` - Menu filtering
- `/docs/NUTRITIONIST_ROLE_PERMISSIONS.md` - Documentation
- `/docs/SIDEBAR_PERMISSION_IMPLEMENTATION.md` - Implementation guide

## Next Steps After Testing
1. Verify other roles (CHEF, QUALITY_CONTROL, etc.) work correctly
2. Test permission system with different user accounts
3. Add more granular permissions if needed
4. Document final permission matrix for all roles
