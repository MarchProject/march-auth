export const authGuard = [
  {
    name: 'uploadInventory',
    type: 'MUTATION',
    class: 'InventoryResolver',
    scopesName: 'InventoryUploadMaker',
  },
  {
    name: 'upsertInventory',
    type: 'MUTATION',
    class: 'InventoryResolver',
    scopesName: 'InventoryUpsert',
  },
  {
    name: 'deleteInventory',
    type: 'MUTATION',
    class: 'InventoryResolver',
    scopesName: 'InventoryDelete',
  },
  {
    name: 'upsertInventoryType',
    type: 'MUTATION',
    class: 'InventoryResolver',
    scopesName: 'InventoryTypeUpsert',
  },
  {
    name: 'deleteInventoryType',
    type: 'MUTATION',
    class: 'InventoryResolver',
    scopesName: 'InventoryTypeDelete',
  },
  {
    name: 'upsertInventoryBrand',
    type: 'MUTATION',
    class: 'InventoryResolver',
    scopesName: 'InventoryBrandUpsert',
  },
  {
    name: 'deleteInventoryBrand',
    type: 'MUTATION',
    class: 'InventoryResolver',
    scopesName: 'InventoryBrandDelete',
  },
  {
    name: 'upsertInventoryBranch',
    type: 'MUTATION',
    class: 'InventoryResolver',
    scopesName: 'InventoryBranchUpsert',
  },
  {
    name: 'deleteInventoryBranch',
    type: 'MUTATION',
    class: 'InventoryResolver',
    scopesName: 'InventoryBranchDelete',
  },
  {
    name: 'favoriteInventory',
    type: 'MUTATION',
    class: 'InventoryResolver',
    scopesName: 'InventoryUpsert',
  },
  {
    name: 'recoveryHardDeleted',
    type: 'MUTATION',
    class: 'InventoryResolver',
    scopesName: 'InventoryTrashMaker',
  },
  {
    name: 'getInventoryNames',
    type: 'QUERY',
    class: 'InventoryResolver',
    scopesName: 'InventoryMainPage',
  },
  {
    name: 'getInventory',
    type: 'QUERY',
    class: 'InventoryResolver',
    scopesName: 'InventoryMainPage',
  },
  {
    name: 'getInventories',
    type: 'QUERY',
    class: 'InventoryResolver',
    scopesName: 'InventoryMainPage',
  },
  {
    name: 'getInventoryType',
    type: 'QUERY',
    class: 'InventoryResolver',
    scopesName: 'InventoryMainPage',
  },
  {
    name: 'getInventoryTypes',
    type: 'QUERY',
    class: 'InventoryResolver',
    scopesName: 'InventoryMainPage',
  },
  {
    name: 'getInventoryBrand',
    type: 'QUERY',
    class: 'InventoryResolver',
    scopesName: 'InventoryMainPage',
  },
  {
    name: 'getInventoryBrands',
    type: 'QUERY',
    class: 'InventoryResolver',
    scopesName: 'InventoryMainPage',
  },
  {
    name: 'getInventoryBranch',
    type: 'QUERY',
    class: 'InventoryResolver',
    scopesName: 'InventoryMainPage',
  },
  {
    name: 'getInventoryBranchs',
    type: 'QUERY',
    class: 'InventoryResolver',
    scopesName: 'InventoryMainPage',
  },
  {
    name: 'getInventoryAllDeleted',
    type: 'QUERY',
    class: 'InventoryResolver',
    scopesName: 'InventoryMainPage',
  },
]
