export type Role = 'owner' | 'admin' | 'member' | 'viewer'

const permissions: Record<Role, string[]> = {
  owner: ['read', 'write', 'delete', 'manage_members', 'manage_billing', 'dispatch_agents'],
  admin: ['read', 'write', 'delete', 'manage_members', 'dispatch_agents'],
  member: ['read', 'write', 'dispatch_agents'],
  viewer: ['read'],
}

export function hasPermission(role: Role, action: string): boolean {
  return permissions[role]?.includes(action) ?? false
}
