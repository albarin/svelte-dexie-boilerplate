<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import * as Section from '$lib/components/ui/section';
	import * as Select from '$lib/components/ui/select';
	import type { Setting } from '$lib/db/models/Setting';
	import { browserLocale, t } from '$lib/translations';
	import { liveQuery } from 'dexie';

	const settingRepo = page.data.settingRepository;

	let language = liveQuery(() => settingRepo.getByKey('language'));
	let selectedLanguage = $state($language?.value || browserLocale);
	$effect(() => {
		selectedLanguage = $language?.value || browserLocale;
	});

	const languages = [
		{ value: 'es', label: 'Español' },
		{ value: 'en', label: 'English' }
	];
	const triggerContent = $derived(
		languages.find((l) => l.value === selectedLanguage)?.label ?? 'Select a language'
	);

	const updateLanguage = async (value: string) => {
		if (!value) {
			return;
		}

		settingRepo.update({
			...$language,
			key: 'language',
			value
		} as Setting);

		invalidateAll();
	};
</script>

<Section.Root>
	<Section.Header>
		<Section.Title>{$t('preferences.language.title')}</Section.Title>
		<Section.Description>
			{$t('preferences.language.description')}
		</Section.Description>
	</Section.Header>
	<Section.Content>
		<Select.Root type="single" bind:value={selectedLanguage} onValueChange={updateLanguage}>
			<Select.Trigger class="w-[180px]">
				{triggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each languages as fruit}
						<Select.Item value={fruit.value} label={fruit.label}>{fruit.label}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</Section.Content>
</Section.Root>
