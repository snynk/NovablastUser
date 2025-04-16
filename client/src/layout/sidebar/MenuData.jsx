const menu = [
  {
    icon: "dashlite",
    text: "Dashboard",
    link: "/",
  },
  {
    icon: "bitcoin-cash",
    text: "Buy Number",
    link: "/buynumber",
  },
  {
    icon: "growth",
    text: "Inbox Message",
    link: "/app-chat",
  },
  {
    icon: "tile-thumb",
    text: "Compaign Management",
    subMenu: [
      {
        text: "Compaign Report",
        link: "/campaignreport",
      },
      {
        text: "Single Message",
        link: "/single-message",
      },
      {
        text: "Bulk Message",
        link: "/bulk-message",
      },
     
    ],
  },
  {
    icon: "users",
    text: "Logs",
    subMenu: [
      {
        text: "Call Logs",
        link: "/user-list-regular",
      },
      {
        text: "Voice Mail",
        link: "/user-list-compact",
      },
    
    ],
  },
  {
    icon: "file-docs",
    text: "Contacts",
    subMenu: [
      {
        text: "Import Contacts",
        link: "/kyc-list-regular",
      },
      {
        text: "Contacts Group",
        link: "/kyc-details-regular/UD01544",
      },
    ],
  },
  {
    icon: "bitcoin-cash",
    text: "Sender Group",
    link: "/crypto",
  },
  {
    icon: "view-col",
    text: "Quick Message",
    link: "/pricing-table",
  },
  {
    icon: "img",
    text: "Notes",
    link: "/image-gallery",
  },
  
  {
    icon: "img",
    text: "Do Not Call & Text List",
    link: "/image-gallery",
  },
  {
    heading: "Admin Navigation",
  },

  {
    icon: "img",
    text: "User Accounts",
    link: "/image-gallery",
  },

  {
    icon: "img",
    text: "Opt Management",
    link: "/image-gallery",
  },

  {
    icon: "img",
    text: "Billing Management",
    link: "/image-gallery",
  },
];
export default menu;
