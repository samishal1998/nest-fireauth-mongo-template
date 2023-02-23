---
inject: true
to: src/app.module.ts
at_line: 0
skip_if: import { <%=Names%>Module }
---
import { <%=Names%>Module } from './<%=names%>/<%=names%>.module';