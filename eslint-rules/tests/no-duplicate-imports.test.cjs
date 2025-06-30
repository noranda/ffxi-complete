const {RuleTester} = require('eslint');

const rule = require('../rules/no-duplicate-imports.cjs');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parser: require('@typescript-eslint/parser'),
    sourceType: 'module',
  },
});

ruleTester.run('no-duplicate-imports', rule, {
  invalid: [
    // Duplicate named imports
    {
      code: 'import { useState } from "react";\nimport { useEffect } from "react";',
      errors: [{messageId: 'duplicateImport'}],
      output: 'import {useEffect, useState} from "react";\n',
    },

    // Mixed default and named imports
    {
      code: 'import React from "react";\nimport { useState } from "react";',
      errors: [{messageId: 'duplicateImport'}],
      output: 'import React, {useState} from "react";\n',
    },

    // Multiple named imports
    {
      code: 'import { Button } from "./components";\nimport { Card } from "./components";\nimport { Input } from "./components";',
      errors: [{messageId: 'duplicateImport'}],
      output: 'import {Button, Card, Input} from "./components";\n\n',
    },

    // Type and regular imports
    {
      code: 'import { createUser } from "./api";\nimport type { User } from "./api";',
      errors: [{messageId: 'duplicateImport'}],
      output: 'import {createUser, type User} from "./api";\n',
    },
  ],

  valid: [
    // Single import from module
    'import { useState } from "react";',
    'import React from "react";',

    // Different modules
    'import { useState } from "react";\nimport { Button } from "./components";',

    // Already combined imports
    'import React, { useState, useEffect } from "react";',
    'import { Button, Card, type ButtonProps } from "./components";',

    // Type-only imports
    'import type { User } from "./types";',
  ],
});
