export const globalStubs = {
  global: {
    stubs: { 'font-awesome-icon': true },
  },
};

/**
 * テスト用のコンポーネントマウントファクトリ関数
 * @param component テスト対象のコンポーネント
 * @param defaultOptions 全テストで共通のデフォルトオプション（Mock、Pluginsなど）
 */

// export function createFactory<C extends Component>(
//   component: C,
//   defaultOptions: ComponentMountingOptions<C> = {},
// ) {
//   return (customOptions: ComponentMountingOptions<C> = {}) => {
//     return mount(component, {
//       ...defaultOptions,
//       ...customOptions,
//       props: {
//         ...defaultOptions.props,
//         ...customOptions.props,
//       },
//       global: {
//         ...defaultOptions.global,
//         ...customOptions.global,
//         plugins: [
//           ...(defaultOptions.global?.plugins || []),
//           ...(customOptions.global?.plugins || []),
//         ],
//         mocks: {
//           ...defaultOptions.global?.mocks,
//           ...customOptions.global?.mocks,
//         },
//       },
//     });
//   };
// };
