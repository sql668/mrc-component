import React from 'react'
import whyDidYouRender from '@welldone-software/why-did-you-render';
// 一般只在开发环境启用
if (process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, {
    trackAllPureComponents: false,
  });
}
