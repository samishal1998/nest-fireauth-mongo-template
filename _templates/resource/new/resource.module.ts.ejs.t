---
to: src/<%=name%>/<%=name%>.module.ts
---
<% Name = h.capitalize(name) %>
import { Module } from '@nestjs/common';
import { <%=Name%>Service } from './<%=name%>.service';
import { <%=Name%>Controller } from './<%=name%>.controller';
<%= websocket ? `import { ${Name}Gateway } from './${name}.gateway';` : null %>

@Module({
	controllers: [<%=Name%>Controller],
	providers: [<%=Name%>Service<%= Boolean(websocket) ? `, ${Name}Gateway` : null %>],
})
export class <%=Name%>Module {}
