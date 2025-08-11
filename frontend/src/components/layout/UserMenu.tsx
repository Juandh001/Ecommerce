'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';

interface UserMenuProps {
  user: User | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const logout = useAuthStore((state) => state.logout);

  if (!user) return null;

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
        <UserIcon className="w-6 h-6" />
        <span className="text-sm font-medium truncate max-w-32">
          {user.firstName} {user.lastName}
        </span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/account"
                className={`${
                  active ? 'bg-gray-100' : ''
                } flex items-center px-4 py-2 text-sm text-gray-700`}
              >
                <UserIcon className="mr-3 h-4 w-4" />
                Mi Cuenta
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/orders"
                className={`${
                  active ? 'bg-gray-100' : ''
                } flex items-center px-4 py-2 text-sm text-gray-700`}
              >
                <Cog6ToothIcon className="mr-3 h-4 w-4" />
                Mis Pedidos
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={logout}
                className={`${
                  active ? 'bg-gray-100' : ''
                } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                Cerrar Sesión
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 