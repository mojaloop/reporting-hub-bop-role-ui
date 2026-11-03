import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Heading, MessageBox, Spinner } from 'components';
import { OperationId, usePermissions } from './permissions';

interface PageProps {
  title: ReactNode;
  back?: { to: string; label: string };
  children?: ReactNode;
}

export function Page({ title, back, children }: PageProps) {
  return (
    <div className="user-iam-app__page">
      {back !== undefined && (
        <Link className="user-iam-app__back" to={back.to}>
          {back.label}
        </Link>
      )}
      <Heading size="3">{title}</Heading>
      {children}
    </div>
  );
}

interface AllowedProps {
  operation: OperationId;
  /** What a caller who does not hold the operation is told. */
  refusal: string;
  children?: ReactNode;
}

/** Its content once the IAM has answered that the caller holds the operation. */
export function Allowed({ operation, refusal, children }: AllowedProps) {
  const { pending, error, can } = usePermissions();
  if (pending) return <Spinner center />;
  if (error !== undefined) return <MessageBox kind="danger">{error.message}</MessageBox>;
  if (!can(operation)) return <MessageBox kind="warning">{refusal}</MessageBox>;
  return <>{children}</>;
}
