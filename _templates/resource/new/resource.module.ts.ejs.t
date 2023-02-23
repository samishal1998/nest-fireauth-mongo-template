---
to: src/<%=names%>/<%=names%>.module.ts
---


import { Module } from '@nestjs/common';
import { <%=Names%>Service } from './<%=names%>.service';
import { <%=Names%>Controller } from './<%=names%>.controller';
<%= websocket ? `import { ${Names}Gateway } from './${names}.gateway';` : null %>

@Module({
	controllers: [<%=Names%>Controller],
	providers: [<%=Names%>Service<%= Boolean(websocket) ? `, ${Names}Gateway` : null %>],
})
export class <%=Names%>Module {}
