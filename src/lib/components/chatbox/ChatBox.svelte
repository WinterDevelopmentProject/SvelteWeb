<script lang="ts">
	let input = '';
	let messages: {
		user: string;
		text: string;
		system?: boolean;
	}[] = [];

	function send() {
		if (!input.trim()) return;
		messages = [...messages, { user: 'You', text: input }];
        console.log('Sent message:', input);
		input = '';
	}
</script>

<div class="chatbox">
	<div class="messages">
		{#each messages as m}
			<p class:system={m.system}>
				{#if !m.system}<strong>{m.user}:</strong>{/if}
				{m.text}
			</p>
		{/each}
	</div>

	<input
		bind:value={input}
		placeholder="채팅 입력"
		on:keydown={(e) => e.key === 'Enter' && send()}
	/>
</div>
