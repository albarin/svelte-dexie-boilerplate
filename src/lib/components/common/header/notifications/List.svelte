<script lang="ts">
	import { page } from '$app/state';
	import { Separator } from '$lib/components/ui/separator';
	import type { Notification } from '$lib/db/models/Notification';
	import { t } from '$lib/translations';
	import { X } from 'lucide-svelte';

	const notificationRepo = page.data.notificationRepository;

	let { notifications }: { notifications: Notification[] } = $props();
</script>

<div class="max-h-80 overflow-scroll">
	{#each notifications as n (n.id)}
		<div key={n.id} class="flex justify-between pl-4 py-2" class:bg-muted={n.read}>
			<button
				class="w-full text-sm text-left"
				title={$t('header.notifications.notification.mark_as_read')}
				onclick={() => notificationRepo.markAsRead(n?.id)}
			>
				{n.message}
			</button>
			<button
				class="px-4 py-3"
				title={$t('header.notifications.notification.delete')}
				onclick={() => notificationRepo.delete(n?.id)}
			>
				<X size="15" />
			</button>
		</div>
		<Separator />
	{/each}
</div>
