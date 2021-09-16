export default {
  read: {
    delay: 200,
    call: (id: string) => {
      const mockProfiles = {
        '1': {
          id: '1',
          name: 'Samuel John',
          assignedRoles: ['RoleA', 'RoleB'],
          assignableRoles: ['RoleA', 'RoleB', 'RoleC', 'RoleD', 'RoleE'],
          assignedParticipants: ['CompanyA', 'CompanyB'],
          assignableParticipants: ['CompanyA', 'CompanyB', 'CompanyC', 'CompanyD', 'CompanyE'],
        },
        '2': {
          id: '2',
          name: 'Roy Tucker',
          assignedRoles: ['RoleA'],
          assignableRoles: ['RoleA', 'RoleB', 'RoleC', 'RoleD', 'RoleE'],
          assignedParticipants: ['CompanyA'],
          assignableParticipants: ['CompanyA', 'CompanyB', 'CompanyC', 'CompanyD', 'CompanyE'],
        },
        '3': {
          id: '3',
          name: 'Samantha Johns',
          assignedRoles: ['RoleA', 'RoleC'],
          assignableRoles: ['RoleA', 'RoleB', 'RoleC', 'RoleD', 'RoleE'],
          assignedParticipants: ['CompanyA', 'CompanyC'],
          assignableParticipants: ['CompanyA', 'CompanyB', 'CompanyC', 'CompanyD', 'CompanyE'],
        },
      };
      return {
        status: 200,
        // @ts-ignore
        data: mockProfiles[id],
      };
    },
  },
};
