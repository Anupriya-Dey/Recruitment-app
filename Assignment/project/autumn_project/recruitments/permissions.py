from rest_framework import permissions

class SecYearPermission(permissions.BasePermission):
    message = 'Second yearites donot have permission'
    def has_permission(self, request, view):

        if request.user.is_authenticated:

            if request.method in permissions.SAFE_METHODS:
                return True
        
            if request.user.year > 2:
                return True

        return False
