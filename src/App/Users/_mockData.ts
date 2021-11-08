export default {
  read: {
    delay: 200,
    call: () => ({
      status: 200,
      data: [
        {
          id: '1',
          name: 'Samuel John',
          assignedRoles: ['RoleA', 'RoleB'],
          assignedParticipants: ['CompanyA', 'CompanyB'],
        },
        {
          id: '2',
          name: 'Roy Tucker',
          assignedRoles: ['RoleA'],
          assignedParticipants: ['CompanyA'],
        },
        {
          id: '3',
          name: 'Samantha Johns',
          assignedRoles: ['RoleA', 'RoleC'],
          assignedParticipants: ['CompanyA', 'CompanyC'],
        },
      ],
    }),
  },
};
