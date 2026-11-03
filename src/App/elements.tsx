import { DetailedHTMLProps, HTMLAttributes, useLayoutEffect, useRef, useState } from 'react';
import {
  Attribute,
  defineIamElements,
  ElementTag,
  IamAssignmentEditorElement,
  IamElement,
  IamEventMap,
  IamRoleEditorElement,
  IamRolesElement,
  IamSubjectsElement,
} from '@mojaloop/authz-ui/elements';
import { useIam } from '../iam';

defineIamElements();

export const RolesElement = ElementTag.roles;
export const SubjectsElement = ElementTag.subjects;
export const RoleEditorElement = ElementTag.roleEditor;
export const AssignmentEditorElement = ElementTag.assignmentEditor;

/** A boolean option as an element attribute: on unless it says `false`. */
export const flag = (on: boolean): string => String(on);

export type Listeners = { [K in keyof IamEventMap]?: (event: IamEventMap[K]) => void };

/**
 * A ref for one of the IAM's elements: it hands the element how this app
 * reaches the IAM before the element first renders, and the element's events
 * to `listeners`, the ones of the latest render.
 */
export function useIamElement<E extends IamElement>(
  listeners: Listeners,
): (element: E | null) => void {
  const iam = useIam();
  const [element, setElement] = useState<E | null>(null);
  const latest = useRef(listeners);
  latest.current = listeners;

  useLayoutEffect(() => {
    if (element === null) return undefined;
    element.fetch = iam.fetch;
    element.eventSource = iam.eventSource;
    const types = Object.keys(latest.current) as Array<keyof IamEventMap>;
    const handler = (event: Event) => {
      const listener = latest.current[event.type as keyof IamEventMap] as
        | ((event: Event) => void)
        | undefined;
      listener?.(event);
    };
    types.forEach((type) => element.addEventListener(type, handler));
    return () => types.forEach((type) => element.removeEventListener(type, handler));
  }, [element, iam]);

  return setElement;
}

type AttributeProps = { [A in Attribute]?: string };
type Props<E extends HTMLElement> = DetailedHTMLProps<HTMLAttributes<E>, E> & AttributeProps;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface IntrinsicElements {
      [ElementTag.roles]: Props<IamRolesElement>;
      [ElementTag.subjects]: Props<IamSubjectsElement>;
      [ElementTag.roleEditor]: Props<IamRoleEditorElement>;
      [ElementTag.assignmentEditor]: Props<IamAssignmentEditorElement>;
    }
  }
}
