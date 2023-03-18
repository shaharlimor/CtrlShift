const pages = {
    id: 'pages',
    type: 'group',
    children: [
        {
            id: 'Insert-Constraints',
            title: 'Insert Constraint',
            type: 'item',
            url: '/constraints',
            breadcrumbs: false
        },
        {
            id: 'Shifts-Board',
            title: 'Shifts Board',
            type: 'item',
            url: '/shifts-board',
            breadcrumbs: false
        },
        {
            id: 'Organization-Manager',
            title: 'Organization Manager',
            type: 'item',
            url: '/manager/organization-manager',
            breadcrumbs: false
        },
        {
            id: 'Shifts-Board-Manager',
            title: 'Monthly Planner',
            type: 'item',
            url: '/manager/shifts-Board',
            breadcrumbs: false
        }
    ]
};

const menuItems = {
    items: [pages]
};

export default menuItems;
