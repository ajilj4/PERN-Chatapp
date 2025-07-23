import { useState } from 'react';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Dropdown, { DropdownItem, DropdownDivider } from '../ui/Dropdown';
import RoleBasedComponent from '../auth/RoleBasedComponent';
import { PERMISSIONS } from '../../utils/authUtils';

export default function UserActions({
  user,
  onRoleChange,
  onStatusChange,
  onDelete,
  roleOptions,
  statusOptions
}) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleRoleChange = (newRole) => {
    onRoleChange(user.id, newRole);
    setShowRoleMenu(false);
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(user.id, newStatus);
    setShowStatusMenu(false);
  };

  const handleDelete = () => {
    onDelete(user.id);
  };

  return (
    <Dropdown
      trigger={
        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
          <EllipsisVerticalIcon className="w-5 h-5" />
        </button>
      }
      placement="bottom-end"
    >
      {/* View Profile */}
      <DropdownItem>
        <UserIcon className="w-4 h-4 mr-2" />
        View Profile
      </DropdownItem>

      <DropdownDivider />

      {/* Role Management */}
      <RoleBasedComponent requiredPermission={PERMISSIONS.MANAGE_ROLES}>
        <Dropdown
          trigger={
            <DropdownItem>
              <ShieldCheckIcon className="w-4 h-4 mr-2" />
              Change Role
            </DropdownItem>
          }
          placement="left-start"
        >
          {roleOptions.map((role) => (
            <DropdownItem
              key={role.value}
              onClick={() => handleRoleChange(role.value)}
              className={user.role === role.value ? 'bg-indigo-50 text-indigo-600' : ''}
            >
              {role.label}
            </DropdownItem>
          ))}
        </Dropdown>
      </RoleBasedComponent>

      {/* Status Management */}
      <RoleBasedComponent requiredPermission={PERMISSIONS.EDIT_USER}>
        <Dropdown
          trigger={
            <DropdownItem>
              <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
              Change Status
            </DropdownItem>
          }
          placement="left-start"
        >
          {statusOptions.map((status) => (
            <DropdownItem
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              className={user.status === status.value ? 'bg-indigo-50 text-indigo-600' : ''}
            >
              {status.label}
            </DropdownItem>
          ))}
        </Dropdown>
      </RoleBasedComponent>

      <DropdownDivider />

      {/* Edit User */}
      <RoleBasedComponent requiredPermission={PERMISSIONS.EDIT_USER}>
        <DropdownItem>
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit User
        </DropdownItem>
      </RoleBasedComponent>

      {/* Delete User */}
      <RoleBasedComponent requiredPermission={PERMISSIONS.DELETE_USER}>
        <DropdownItem danger onClick={handleDelete}>
          <TrashIcon className="w-4 h-4 mr-2" />
          Delete User
        </DropdownItem>
      </RoleBasedComponent>
    </Dropdown>
  );
}
