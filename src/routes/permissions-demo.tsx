import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UserSwitcher from '@/components/auth/UserSwitcher';
import { usePermissions } from '@/hooks/use-permissions';
import { Permission } from '@/lib/auth/permissions';
import { Link } from '@tanstack/react-router';
import { 
  Home, 
  Users, 
  Shield, 
  AlertTriangle, 
  FileText,
  MessageSquare,
  Plus,
  Heart
} from 'lucide-react';

export const Route = createFileRoute('/permissions-demo')({
  component: PermissionsDemoPage,
});

function PermissionsDemoPage() {
  const { hasPermission, isAuthenticated, isAdmin, isModerator, getUserRole } = usePermissions();

  const permissions = [
    { permission: Permission.VIEW_DASHBOARD, label: 'Xem Dashboard', icon: Home },
    { permission: Permission.VIEW_COMMUNITY, label: 'Xem Community', icon: Users },
    { permission: Permission.COMMENT_POST, label: 'Bình luận', icon: MessageSquare },
    { permission: Permission.CREATE_POST, label: 'Đăng bài', icon: Plus },
    { permission: Permission.LIKE_POST, label: 'Thích bài', icon: Heart },
    { permission: Permission.VIEW_CITIZEN_PORTAL, label: 'Citizen Portal', icon: Shield },
    { permission: Permission.VIEW_EMERGENCY_MANAGEMENT, label: 'Emergency Management', icon: AlertTriangle },
    { permission: Permission.VIEW_EOP_REPORTS, label: 'EOP Reports', icon: FileText },
  ];

  const routes = [
    { path: '/home', label: 'Dashboard', requiresAdmin: false },
    { path: '/community', label: 'Community', requiresAdmin: false },
    { path: '/citizen', label: 'Citizen Portal', requiresAdmin: true },
    { path: '/area-selection', label: 'Emergency Management', requiresAdmin: true },
    { path: '/eop', label: 'EOP Reports', requiresAdmin: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demo Phân Quyền SOSConn
          </h1>
          <p className="text-gray-600">
            Test hệ thống phân quyền với các vai trò khác nhau
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Switcher */}
          <div className="lg:col-span-1">
            <UserSwitcher />
            
            {/* Current Status */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Đã đăng nhập:</span>
                  <Badge variant={isAuthenticated() ? "default" : "secondary"}>
                    {isAuthenticated() ? "Có" : "Không"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Vai trò:</span>
                  <Badge>{getUserRole()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Admin:</span>
                  <Badge variant={isAdmin() ? "destructive" : "secondary"}>
                    {isAdmin() ? "Có" : "Không"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Moderator:</span>
                  <Badge variant={isModerator() ? "default" : "secondary"}>
                    {isModerator() ? "Có" : "Không"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Permissions */}
            <Card>
              <CardHeader>
                <CardTitle>Quyền hạn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {permissions.map(({ permission, label, icon: Icon }) => (
                    <div
                      key={permission}
                      className={`flex items-center space-x-3 p-3 rounded-lg border ${
                        hasPermission(permission)
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{label}</span>
                      <Badge
                        variant={hasPermission(permission) ? "default" : "secondary"}
                        className="ml-auto"
                      >
                        {hasPermission(permission) ? "Có" : "Không"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Route Access */}
            <Card>
              <CardHeader>
                <CardTitle>Truy cập Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {routes.map(({ path, label, requiresAdmin }) => {
                    const canAccess = requiresAdmin ? isAdmin() : true;
                    
                    return (
                      <div
                        key={path}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          canAccess
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{label}</span>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {path}
                          </code>
                          {requiresAdmin && (
                            <Badge variant="outline" className="text-xs">
                              Admin only
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={canAccess ? "default" : "destructive"}
                          >
                            {canAccess ? "Có thể truy cập" : "Bị chặn"}
                          </Badge>
                          
                          <Link to={path}>
                            <Button
                              size="sm"
                              variant={canAccess ? "default" : "destructive"}
                            >
                              Test
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Test Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/community">
                    <Button variant="outline">
                      Xem Community
                    </Button>
                  </Link>
                  
                  {hasPermission(Permission.VIEW_CITIZEN_PORTAL) ? (
                    <Link to="/citizen">
                      <Button>Citizen Portal</Button>
                    </Link>
                  ) : (
                    <Button disabled>
                      Citizen Portal (Cần Admin)
                    </Button>
                  )}
                  
                  {hasPermission(Permission.VIEW_EMERGENCY_MANAGEMENT) ? (
                    <Link to="/area-selection">
                      <Button>Emergency Management</Button>
                    </Link>
                  ) : (
                    <Button disabled>
                      Emergency Management (Cần Admin)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}