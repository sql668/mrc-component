export interface TreeDemoProp {
  menuId: string
  menuName: string
  children?: TreeDemoProp[]
}

export const TreeDemoData = [
  {
    menuName: "系统管理",
    menuId: "1",
    children: [
      {
        menuName: "用户管理",
        menuId: "1-1",
        children: [
          {
            menuName: "用户列表",
            menuId: "1-1-1"
          },
          {
            menuName: "用户新增",
            menuId: "1-1-2"
          }
        ]
      },
      {
        menuName: "角色管理",
        menuId: "1-2",
        children: [
          {
            menuName: "角色列表",
            menuId: "1-2-1"
          },
          // {
          //   menuName: "角色新增",
          //   menuId: "1-2-2"
          // }
        ]
      },
      // {
      //   menuName: "菜单管理",
      //   menuId: "1-3",
      //   children: [
      //     {
      //       menuName: "菜单列表",
      //       menuId: "1-3-1"
      //     },
      //     {
      //       menuName: "菜单新增",
      //       menuId: "1-3-2"
      //     }
      //   ]
      // }
    ]
  },
  {
    menuId: "4",
    menuName: "4",
    children: [
      {
        menuId: "4-1",
        menuName: "4-1",
        children: [
          {
            menuName: "4-1-1",
            menuId: "4-1-1",
            children: [
              {
                menuName: "4-1-1-1",
                menuId: "4-1-1-1"
              },
              {
                menuName: "4-1-1-2",
                menuId: "4-1-1-2"
              }
            ]
          },
          {
            menuName: "4-1-2",
            menuId: "4-1-2",
            children: [
              {
                menuName: "4-1-2-1",
                menuId: "4-1-2-1"
              }
            ]
          }
        ]
      },
      {
        menuId: "4-2",
        menuName: "4-2"
      }
    ]
  }
]
