/* Payload admin console root layout. Do not add site chrome here — this tree
   is entirely owned by Payload and renders its own <html>/<body>. */
import type { ServerFunctionClient } from 'payload'
import type React from 'react'

import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'

import { importMap } from './admin/importMap'

import '@payloadcms/next/css'

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function PayloadAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
