'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

import SwaggerUIProps from "swagger-ui-react/swagger-ui-react";
import 'swagger-ui-react/swagger-ui.css';

interface Props {
  spec: Record<string, any>;
}

const SwaggerUI = dynamic<SwaggerUIProps>(
  async () => {
    const mod = await import('swagger-ui-react');
    return mod.default as ComponentType<SwaggerUIProps>;
  },
  { ssr: false }
);

export default function ReactSwagger({ spec }: Props) {
  return <SwaggerUI spec={spec} />;
}
