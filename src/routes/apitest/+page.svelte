<script lang="ts">
	import { onMount } from 'svelte';
	import { io, type Socket } from 'socket.io-client';

	type Meta = {
		ok: boolean;
		startedAt: string;
		uptimeSec: number;
		uniqueVisitors: number;
		connected: number;
	};

	type PresenceUser = { visitorId: string; name: string; joinedAt: number };
	type Presence = { connected: number; users: PresenceUser[] };

	type ChatMsg = { id: string; from: string; visitorId: string; text: string; ts: number };

	let meta: Meta | null = null;
	let presence: Presence = { connected: 0, users: [] };
	let messages: ChatMsg[] = [];

	let name = '';
	let input = '';
	let socket: Socket | null = null;
	let connected = false;

	function getVisitorId(): string {
		const key = 'wdp_visitor_id';
		let v = localStorage.getItem(key);
		if (!v) {
			v = crypto.randomUUID();
			localStorage.setItem(key, v);
		}
		return v;
	}

	async function loadMeta() {
		const res = await fetch('https://game.0x51018.com/api/meta');
		meta = await res.json();
	}

	function connect() {
		if (socket) return;

		const visitorId = getVisitorId();
		const safeName = name.trim().slice(0, 20);

		socket = io('https://game.0x51018.com', {
			path: '/socket',
			auth: {
				visitorId,
				name: safeName || undefined
			}
		});

		socket.on('connect', () => (connected = true));
		socket.on('disconnect', () => (connected = false));

		socket.on('presence:list', (p: Presence) => {
			presence = p;
		});

		socket.on('chat:message', (m: ChatMsg) => {
			messages = [...messages, m].slice(-200);
			// meta의 connected/unique는 API에서 오므로 주기적으로 refresh 원하면 loadMeta 호출
		});

		socket.on('pong', () => {
			// 필요하면 UI 표시
		});
	}

	function disconnect() {
		socket?.disconnect();
		socket = null;
		connected = false;
	}

	function send() {
		const text = input.trim();
		if (!text || !socket) return;
		socket.emit('chat:send', { text });
		input = '';
	}

	onMount(() => {
		loadMeta();
		connect();
	});
</script>

<main style="max-width: 900px; margin: 24px auto; padding: 0 16px; font-family: system-ui;">
	<h1>Game Test Console</h1>

	<section style="display:flex; gap:12px; flex-wrap:wrap; margin: 12px 0;">
		<div style="border:1px solid #ddd; padding:12px; border-radius:8px; flex:1; min-width:240px;">
			<div style="display:flex; justify-content:space-between; align-items:center;">
				<strong>API Meta</strong>
				<button on:click={loadMeta}>Refresh</button>
			</div>
			{#if meta}
				<div>Started: {meta.startedAt}</div>
				<div>Uptime: {meta.uptimeSec}s</div>
				<div>Unique visitors: {meta.uniqueVisitors}</div>
				<div>Connected: {meta.connected}</div>
			{:else}
				<div>Loading...</div>
			{/if}
			<div style="opacity:.7; margin-top:8px;">(GET /api/meta)</div>
		</div>

		<div style="border:1px solid #ddd; padding:12px; border-radius:8px; flex:1; min-width:240px;">
			<strong>Socket</strong>
			<div>Status: {connected ? 'connected' : 'disconnected'}</div>
			<div>Online: {presence.connected}</div>
			<div style="display:flex; gap:8px; margin-top:8px;">
				<input placeholder="nickname (optional)" bind:value={name} style="flex:1;" />
				{#if socket}
					<button on:click={disconnect}>Disconnect</button>
				{:else}
					<button on:click={connect}>Connect</button>
				{/if}
			</div>
			<div style="opacity:.7; margin-top:8px;">(Socket path: /socket)</div>
		</div>
	</section>

	<section style="display:grid; grid-template-columns: 1fr 2fr; gap:12px;">
		<div style="border:1px solid #ddd; padding:12px; border-radius:8px; min-height: 320px;">
			<strong>Presence</strong>
			<div style="opacity:.7; margin:6px 0;">(presence:list)</div>
			<ul>
				{#each presence.users as u (u.visitorId)}
					<li>{u.name} <span style="opacity:.5;">({u.visitorId.slice(0, 6)})</span></li>
				{/each}
			</ul>
		</div>

		<div
			style="border:1px solid #ddd; padding:12px; border-radius:8px; display:flex; flex-direction:column; min-height: 320px;"
		>
			<strong>Chat</strong>
			<div style="opacity:.7; margin:6px 0;">(chat:send → chat:message)</div>

			<div
				style="flex:1; overflow:auto; border:1px solid #eee; padding:8px; border-radius:6px; margin-bottom:10px;"
			>
				{#each messages as m (m.id)}
					<div style="margin-bottom:6px;">
						<b>{m.from}:</b>
						{m.text}
						<span style="opacity:.5; font-size: 12px;"> {new Date(m.ts).toLocaleTimeString()}</span>
					</div>
				{/each}
			</div>

			<div style="display:flex; gap:8px;">
				<input
					placeholder="type message..."
					bind:value={input}
					on:keydown={(e) => e.key === 'Enter' && send()}
					style="flex:1;"
				/>
				<button on:click={send} disabled={!socket}>Send</button>
			</div>
		</div>
	</section>
</main>
