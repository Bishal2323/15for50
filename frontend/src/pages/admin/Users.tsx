import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  AlertTriangle,
  User,
  Users,
  UserCheck
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUsers, deleteUser, updateUser, deleteUsersByRole, type User as UserType, type BackendRole } from '@/lib/api'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'



const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return <Shield className="h-4 w-4" />
    case "coach":
      return <Users className="h-4 w-4" />
    case "physio":
      return <UserCheck className="h-4 w-4" />
    case "athlete":
      return <User className="h-4 w-4" />
    default:
      return <User className="h-4 w-4" />
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "high"
    case "coach":
      return "monitor"
    case "physio":
      return "safe"
    case "athlete":
      return "outline"
    default:
      return "outline"
  }
}

// Removed unused getStatusColor helper

export function AdminUsers() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [currentPage] = useState(1)
  const [, setTotalPages] = useState(1)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [editEmail, setEditEmail] = useState<string>('')
  const [editRole, setEditRole] = useState<BackendRole>('Athlete')
  const [editTeamId, setEditTeamId] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined
      })
      setUsers(data.users)
      setTotalPages(data.pagination.totalPages)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, roleFilter])

  const openEditModal = (user: UserType) => {
    setEditingUser(user)
    setEditEmail(user.email)
    setEditRole(user.role)
    setEditTeamId(user.teamId || '')
    setSaveError(null)
  }

  const closeEditModal = () => {
    setEditingUser(null)
    setSaveError(null)
  }

  const handleSaveUser = async () => {
    if (!editingUser) return
    try {
      setSaving(true)
      setSaveError(null)
      await updateUser(editingUser._id, {
        email: editEmail,
        role: editRole,
        teamId: editTeamId || undefined,
      })
      await fetchUsers()
      closeEditModal()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await deleteUser(userId)
      await fetchUsers() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  const handleBulkDeleteAthletes = async () => {
    if (!confirm('Delete ALL athletes? This cannot be undone.')) return
    try {
      setBulkDeleting(true)
      const res = await deleteUsersByRole('Athlete')
      toast.success(res.message)
      await fetchUsers()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete athletes'
      setError(msg)
      toast.error(msg)
    } finally {
      setBulkDeleting(false)
    }
  }

  if (loading && users.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading users...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const roleStats = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage system users and their permissions</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search by email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Athlete">Athlete</SelectItem>
              <SelectItem value="Coach">Coach</SelectItem>
              <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button variant="destructive" onClick={handleBulkDeleteAthletes} disabled={bulkDeleting}>
            {bulkDeleting ? 'Deleting...' : 'Delete All Athletes'}
          </Button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{users.length}</div>
            <p className="text-xs text-muted-foreground">Loaded from server</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Athletes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{roleStats['Athlete'] || 0}</div>
            <p className="text-xs text-muted-foreground">Registered athletes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{(roleStats['Coach'] || 0) + (roleStats['Physiotherapist'] || 0)}</div>
            <p className="text-xs text-muted-foreground">Coaches &amp; Physios</p>
          </CardContent>
        </Card>
        {/* Admins card removed to prevent viewing Admin counts */}
      </div>

      {/* Filters moved to header; removing duplicate controls */}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>Overview of all registered users and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback>{(user.email[0] || 'U').toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-xs text-muted-foreground">ID {user._id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <Badge variant={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{user.teamId || '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => openEditModal(user)}>
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" className="flex items-center gap-1" onClick={() => handleDeleteUser(user._id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Modal open={!!editingUser} onClose={closeEditModal} title="Edit User">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Email</label>
            <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="user@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Role</label>
            <Select value={editRole} onValueChange={(val) => setEditRole(val as BackendRole)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Athlete">Athlete</SelectItem>
                <SelectItem value="Coach">Coach</SelectItem>
                <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Team ID</label>
            <Input value={editTeamId} onChange={(e) => setEditTeamId(e.target.value)} placeholder="optional team id" />
          </div>
          {saveError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeEditModal} disabled={saving}>Cancel</Button>
            <Button onClick={handleSaveUser} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
            <CardDescription>Breakdown of users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Athletes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-4/5 h-full bg-primary rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">128</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Coaches</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-1/4 h-full bg-monitor rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">18</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Physiotherapists</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-1/5 h-full bg-safe rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">8</span>
                </div>
              </div>
              {/* Administrators distribution removed */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user registrations and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">JS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm">Jordan Smith joined</div>
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </div>
                <Badge variant="safe" className="text-xs">New</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">MW</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm">Mike Wilson updated profile</div>
                  <div className="text-xs text-muted-foreground">1 day ago</div>
                </div>
                <Badge variant="monitor" className="text-xs">Update</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">ED</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm">Emma Davis role changed</div>
                  <div className="text-xs text-muted-foreground">3 days ago</div>
                </div>
                <Badge variant="high" className="text-xs">Role</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
