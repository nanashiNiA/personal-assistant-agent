import React from 'react';
import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-semibold">
              アシスタントエージェント
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
                ホーム
              </Link>
              <Link href="/memory" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
                記憶システム
              </Link>
              <Link href="/conversation" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
                会話
              </Link>
              <Link href="/tasks" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
                タスク
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}