import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/study/',
    component: ComponentCreator('/study/', '3ab'),
    exact: true
  },
  {
    path: '/study/__docusaurus/debug',
    component: ComponentCreator('/study/__docusaurus/debug', 'ff7'),
    exact: true
  },
  {
    path: '/study/__docusaurus/debug/config',
    component: ComponentCreator('/study/__docusaurus/debug/config', '654'),
    exact: true
  },
  {
    path: '/study/__docusaurus/debug/content',
    component: ComponentCreator('/study/__docusaurus/debug/content', 'f36'),
    exact: true
  },
  {
    path: '/study/__docusaurus/debug/globalData',
    component: ComponentCreator('/study/__docusaurus/debug/globalData', '44e'),
    exact: true
  },
  {
    path: '/study/__docusaurus/debug/metadata',
    component: ComponentCreator('/study/__docusaurus/debug/metadata', '77a'),
    exact: true
  },
  {
    path: '/study/__docusaurus/debug/registry',
    component: ComponentCreator('/study/__docusaurus/debug/registry', '593'),
    exact: true
  },
  {
    path: '/study/__docusaurus/debug/routes',
    component: ComponentCreator('/study/__docusaurus/debug/routes', '5d5'),
    exact: true
  },
  {
    path: '/study/blog',
    component: ComponentCreator('/study/blog', '17b'),
    exact: true
  },
  {
    path: '/study/blog/archive',
    component: ComponentCreator('/study/blog/archive', '771'),
    exact: true
  },
  {
    path: '/study/blog/first-blog-post',
    component: ComponentCreator('/study/blog/first-blog-post', '7f9'),
    exact: true
  },
  {
    path: '/study/blog/long-blog-post',
    component: ComponentCreator('/study/blog/long-blog-post', 'd3d'),
    exact: true
  },
  {
    path: '/study/blog/mdx-blog-post',
    component: ComponentCreator('/study/blog/mdx-blog-post', '6e3'),
    exact: true
  },
  {
    path: '/study/blog/tags',
    component: ComponentCreator('/study/blog/tags', '875'),
    exact: true
  },
  {
    path: '/study/blog/tags/docusaurus',
    component: ComponentCreator('/study/blog/tags/docusaurus', '011'),
    exact: true
  },
  {
    path: '/study/blog/tags/facebook',
    component: ComponentCreator('/study/blog/tags/facebook', '2db'),
    exact: true
  },
  {
    path: '/study/blog/tags/hello',
    component: ComponentCreator('/study/blog/tags/hello', 'd7c'),
    exact: true
  },
  {
    path: '/study/blog/tags/hola',
    component: ComponentCreator('/study/blog/tags/hola', 'b41'),
    exact: true
  },
  {
    path: '/study/blog/welcome',
    component: ComponentCreator('/study/blog/welcome', '2dc'),
    exact: true
  },
  {
    path: '/study/markdown-page',
    component: ComponentCreator('/study/markdown-page', 'a08'),
    exact: true
  },
  {
    path: '/study/docs',
    component: ComponentCreator('/study/docs', '9d2'),
    routes: [
      {
        path: '/study/docs',
        component: ComponentCreator('/study/docs', 'cce'),
        routes: [
          {
            path: '/study/docs',
            component: ComponentCreator('/study/docs', '0b8'),
            routes: [
              {
                path: '/study/docs/category/tutorial---basics',
                component: ComponentCreator('/study/docs/category/tutorial---basics', 'c77'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/study/docs/category/tutorial---extras',
                component: ComponentCreator('/study/docs/category/tutorial---extras', 'db6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/study/docs/intro',
                component: ComponentCreator('/study/docs/intro', '47e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/study/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/study/docs/tutorial-basics/congratulations', '3ad'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/study/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/study/docs/tutorial-basics/create-a-blog-post', 'efc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/study/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/study/docs/tutorial-basics/create-a-document', 'bec'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/study/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/study/docs/tutorial-basics/create-a-page', 'e7f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/study/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/study/docs/tutorial-basics/deploy-your-site', '810'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/study/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/study/docs/tutorial-basics/markdown-features', 'bcc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/study/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/study/docs/tutorial-extras/manage-docs-versions', '30f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/study/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/study/docs/tutorial-extras/translate-your-site', 'aea'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
