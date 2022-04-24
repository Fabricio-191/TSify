/* eslint-disable @typescript-eslint/ban-types */

interface commandMetadata {
	webCommandMetadata: webCommandMetadata | webCommandMetadata21 | webCommandMetadata43 | webCommandMetadata86;
}

interface accessibilityData {
	label: string;
}

interface runs {
	text: string;
	navigationEndpoint?: navigationEndpoint;
	bold?: boolean;
}

interface accessibility {
	accessibilityData: accessibilityData;
}

interface thumbnails {
	url: string;
	width: number;
	height: number;
}

interface title {
	runs: runs[];
}

interface webCommandMetadata {
	url: string;
	webPageType: string;
	rootVe: number;
	apiUrl?: string;
}

interface defaultText {
	accessibility: accessibility;
	simpleText: string;
}

interface navigationEndpoint {
	clickTrackingParams: string;
	commandMetadata: commandMetadata;
	signInEndpoint?: signInEndpoint | signInEndpoint38 | {
		idamTag: string;
	} | {
		nextEndpoint: navigationEndpoints;
		continueAction: string;
		idamTag: string;
	};
	modalEndpoint?: modalEndpoint;
	browseEndpoint?: browseEndpoint;
	urlEndpoint?: urlEndpoint;
}

interface browseEndpoint {
	browseId: string;
	canonicalBaseUrl?: string;
}

interface viewCount {
	simpleText: string;
}

interface watchEndpoint {
	videoId: string;
	playlistId?: string;
	index?: number;
	params?: string;
	playerParams?: string;
	loggingContext?: loggingContext;
	watchEndpointSupportedPrefetchConfig?: watchEndpointSupportedPrefetchConfig;
	watchEndpointSupportedOnesieConfig?: watchEndpointSupportedOnesieConfig;
	nofollow?: boolean;
	continuePlayback?: boolean;
}

interface navigationEndpoints {
	clickTrackingParams: string;
	commandMetadata: commandMetadata;
	watchEndpoint: watchEndpoint;
}

interface commonConfig {
	url: string;
}

interface html5PlaybackOnesieConfig {
	commonConfig: commonConfig;
}

interface watchEndpointSupportedOnesieConfig {
	html5PlaybackOnesieConfig: html5PlaybackOnesieConfig;
}

interface icon {
	iconType: string;
}

interface thumbnail {
	thumbnails: thumbnails[];
	sampledThumbnailColor?: {
		red: number;
		green: number;
		blue: number;
	};
}

interface vssLoggingContext {
	serializedContextData: string;
}

interface loggingContext {
	vssLoggingContext: vssLoggingContext;
}

interface thumbnailOverlays105 {
	thumbnailOverlayNowPlayingRenderer: thumbnailOverlayNowPlayingRenderer;
}

interface thumbnailOverlayNowPlayingRenderer {
	text: title;
}

interface thumbnailOverlays {
	thumbnailOverlayTimeStatusRenderer: thumbnailOverlayTimeStatusRenderer;
}

interface thumbnailOverlayTimeStatusRenderer {
	text: defaultText;
	style: string;
}

interface playlistPanelVideoRenderer {
	title: defaultText;
	longBylineText: title;
	thumbnail: thumbnail;
	lengthText: defaultText;
	indexText: viewCount;
	selected: boolean;
	navigationEndpoint: navigationEndpoints;
	videoId: string;
	shortBylineText: title;
	trackingParams: string;
	thumbnailOverlays: [
		thumbnailOverlays,
		thumbnailOverlays105
	];
	playlistSetVideoId: string;
}

interface contents119 {
	playlistPanelVideoRenderer: playlistPanelVideoRenderer;
}

interface webCommandMetadata43 {
	sendPost: boolean;
	apiUrl: string;
}

interface serviceEndpoint {
	clickTrackingParams: string;
	commandMetadata: commandMetadata;
	shareEntityServiceEndpoint?: shareEntityServiceEndpoint;
	signalServiceEndpoint?: signalServiceEndpoint;
}

interface signalServiceEndpoint {
	signal: string;
	actions: [
		actions | commands,
		commands?
	];
}

interface webCommandMetadata86 {
	sendPost: boolean;
}

interface actions {
	clickTrackingParams: string;
	addToPlaylistCommand?: addToPlaylistCommand;
	signalAction?: signalAction;
}

interface untoggledServiceEndpoint {
	clickTrackingParams: string;
	commandMetadata: commandMetadata;
	playlistEditEndpoint: playlistEditEndpoint;
}

interface playlistEditEndpoint {
	playlistId: string;
	actions: actions98 | actions101[];
}

interface addToPlaylistCommand {
	openMiniplayer: boolean;
	openListPanel: boolean;
	videoId: string;
	listType: string;
	onCreateListCommand: onCreateListCommand;
	videoIds: string[];
}

interface thumbnailOverlayToggleButtonRenderer {
	isToggled?: boolean;
	untoggledIcon: icon;
	toggledIcon: icon;
	untoggledTooltip: string;
	toggledTooltip: string;
	untoggledServiceEndpoint: serviceEndpoint | untoggledServiceEndpoint;
	toggledServiceEndpoint?: untoggledServiceEndpoint;
	untoggledAccessibility: accessibility;
	toggledAccessibility: accessibility;
	trackingParams: string;
}

interface thumbnailOverlays103 {
	thumbnailOverlayToggleButtonRenderer: thumbnailOverlayToggleButtonRenderer;
}

interface onCreateListCommand {
	clickTrackingParams: string;
	commandMetadata: commandMetadata;
	createPlaylistServiceEndpoint: createPlaylistServiceEndpoint;
}

interface urlEndpoint {
	url: string;
	target: string;
	nofollow?: boolean;
}

interface createPlaylistServiceEndpoint {
	videoIds: string[];
	params: string;
}

interface initRange {
	start: string;
	end: string;
}

interface commands {
	clickTrackingParams: string;
	openPopupAction?: openPopupAction;
	changeEngagementPanelVisibilityAction?: changeEngagementPanelVisibilityAction;
	scrollToEngagementPanelCommand?: {
		targetId: string;
	};
	updateToggleButtonStateCommand?: {
		toggled: boolean;
		buttonId: string;
	};
}

interface options {
	hotkeyDialogSectionOptionRenderer: hotkeyDialogSectionOptionRenderer;
}

interface hotkeyDialogSectionOptionRenderer {
	label: title;
	hotkey: string;
	hotkeyAccessibilityLabel?: accessibility;
}

interface openPopupAction {
	popup: menuRenderer180 | popup | popup92 | {
		voiceSearchDialogRenderer: {
			placeholderHeader: title;
			promptHeader: title;
			exampleQuery1: title;
			exampleQuery2: title;
			promptMicrophoneLabel: title;
			loadingHeader: title;
			connectionErrorHeader: title;
			connectionErrorMicrophoneLabel: title;
			permissionsHeader: title;
			permissionsSubtext: title;
			disabledHeader: title;
			disabledSubtext: title;
			microphoneButtonAriaLabel: title;
			exitButton: button;
			trackingParams: string;
			microphoneOffPromptHeader: title;
		};
	};
	popupType: string;
	beReused?: boolean;
}

interface buttonRenderer {
	style?: string;
	size?: string;
	isDisabled?: boolean;
	text?: title | viewCount;
	navigationEndpoint?: navigationEndpoint | serviceEndpoint;
	trackingParams: string;
	serviceEndpoint?: serviceEndpoint;
	icon?: icon;
	tooltip?: string;
	accessibilityData?: accessibility;
	accessibility?: accessibilityData;
	command?: continuationEndpoint | navigationEndpoint | serviceEndpoint | showMoreCommand;
	targetId?: string;
}

interface popup92 {
	notificationActionRenderer: notificationActionRenderer;
}

interface button {
	buttonRenderer: buttonRenderer;
}

interface notificationActionRenderer {
	responseText: title | viewCount;
	trackingParams: string;
}

interface menuRenderer {
	items?: items95[] | {
		menuNavigationItemRenderer: {
			text: title;
			icon: icon;
			navigationEndpoint: navigationEndpoint;
			trackingParams: string;
		};
	};
	trackingParams: string;
	topLevelButtons?: Array<button | topLevelButtons>;
	accessibility?: accessibility;
	targetId?: string;
}

interface params {
	key: string;
	value: string;
}

interface videoActions {
	menuRenderer: menuRenderer;
}

interface actions101 {
	action: string;
	removedVideoId: string;
}

interface actions98 {
	addedVideoId: string;
	action: string;
}

interface channelThumbnail {
	thumbnails: thumbnails[];
}

interface compactVideoRenderer {
	videoId: string;
	thumbnail: thumbnail;
	title: defaultText;
	longBylineText: title;
	publishedTimeText: viewCount;
	viewCountText: viewCount;
	lengthText: defaultText;
	navigationEndpoint: navigationEndpoints;
	shortBylineText: title;
	channelThumbnail: channelThumbnail;
	ownerBadges?: badges[];
	trackingParams: string;
	shortViewCountText: defaultText;
	menu: videoActions;
	thumbnailOverlays: [
		thumbnailOverlays,
		thumbnailOverlays103,
		thumbnailOverlays103,
		thumbnailOverlays105
	];
	accessibility: accessibility;
}

interface menuServiceItemRenderer {
	text: title;
	icon: icon;
	serviceEndpoint: serviceEndpoint;
	trackingParams: string;
}

interface results107 {
	compactVideoRenderer: compactVideoRenderer;
}

interface items95 {
	menuServiceItemRenderer: menuServiceItemRenderer;
}

interface badges {
	metadataBadgeRenderer: metadataBadgeRenderer;
}

interface adaptiveFormats {
	itag: number;
	mimeType: string;
	bitrate: number;
	width?: number;
	height?: number;
	initRange: initRange;
	indexRange: initRange;
	lastModified: string;
	contentLength: string;
	quality: string;
	fps?: number;
	qualityLabel?: string;
	projectionType: string;
	averageBitrate: number;
	approxDurationMs: string;
	signatureCipher: string;
	colorInfo?: colorInfo;
	highReplication?: boolean;
	audioQuality?: string;
	audioSampleRate?: string;
	audioChannels?: number;
	loudnessDb?: number;
}

interface metadataBadgeRenderer {
	icon: icon;
	style: string;
	tooltip: string;
	trackingParams: string;
	accessibilityData: accessibilityData;
}

interface prefetchHintConfig {
	prefetchPriority: number;
	playbackRelativeSecondsPrefetchCondition: number;
}

interface watchEndpointSupportedPrefetchConfig {
	prefetchHintConfig: prefetchHintConfig;
}

interface endScreenVideoRenderer {
	videoId: string;
	thumbnail: thumbnail;
	title: defaultText;
	shortBylineText: title;
	lengthText: defaultText;
	lengthInSeconds: number;
	navigationEndpoint: navigationEndpoints;
	trackingParams: string;
	shortViewCountText: defaultText;
	publishedTimeText: viewCount;
	thumbnailOverlays: [
		thumbnailOverlays,
		thumbnailOverlays105
	];
}

interface autoplayVideo {
	clickTrackingParams: string;
	commandMetadata: commandMetadata;
	watchPlaylistEndpoint: watchPlaylistEndpoint;
}

interface results137 {
	endScreenVideoRenderer: endScreenVideoRenderer;
}

interface watchPlaylistEndpoint {
	playlistId: string;
	index: number;
	params: string;
}

interface style {
	styleType: string;
}

interface serviceTrackingParams {
	service: string;
	params: params[];
}

interface colorInfo {
	primaries: string;
	transferCharacteristics: string;
	matrixCoefficients: string;
}

interface uiActions {
	hideEnclosingContainer: boolean;
}

interface feedbackEndpoint {
	feedbackToken: string;
	uiActions: uiActions;
}

interface modalWithTitleAndButtonRenderer {
	title: title | viewCount;
	content: title | viewCount;
	button: button;
}

interface impressionEndpoints {
	clickTrackingParams: string;
	commandMetadata: commandMetadata;
	feedbackEndpoint: feedbackEndpoint;
}

interface webCommandMetadata21 {
	ignoreNavigation: boolean;
}

interface modal {
	modalWithTitleAndButtonRenderer: modalWithTitleAndButtonRenderer;
}

interface modalEndpoint {
	modal: modal;
}

interface toggleButtonRenderer {
	style: style;
	isToggled: boolean;
	isDisabled: boolean;
	defaultIcon: icon;
	defaultText?: defaultText | viewCount;
	toggledText?: defaultText | viewCount;
	accessibility?: accessibilityData;
	trackingParams: string;
	defaultTooltip: string;
	toggledTooltip: string;
	toggledStyle: style;
	defaultNavigationEndpoint?: navigationEndpoint;
	accessibilityData?: accessibility;
	toggleButtonSupportedData?: toggleButtonSupportedData;
	targetId?: string;
	size?: size;
	defaultServiceEndpoint?: serviceEndpoint;
	toggledServiceEndpoint?: serviceEndpoint;
	toggledIcon?: icon;
	toggledAccessibilityData?: accessibility;
}

interface showMoreCommand {
	clickTrackingParams: string;
	commandExecutorCommand: commandExecutorCommand;
}

interface commandExecutorCommand {
	commands: [
		commands | impressionEndpoints | navigationEndpoint,
		(commands | {
			commandMetadata: commandMetadata;
			feedbackEndpoint: feedbackEndpoint;
		})?
	];
}

interface topLevelButtons {
	toggleButtonRenderer: toggleButtonRenderer;
}

interface videostatsPlaybackUrl {
	baseUrl: string;
}

interface sets {
	mode: string;
	autoplayVideo: navigationEndpoints;
	nextButtonVideo: navigationEndpoints;
	previousButtonVideo?: navigationEndpoints;
}

interface modifiedSets {
	autoplayVideo: autoplayVideo;
	nextButtonVideo: autoplayVideo;
	previousButtonVideo?: autoplayVideo;
}

interface items176 {
	compactLinkRenderer: compactLinkRenderer;
}

interface sections187 {
	hotkeyDialogSectionRenderer: hotkeyDialogSectionRenderer;
}

interface hotkeyDialogSectionRenderer {
	title: title;
	options: options[];
}

interface compactLinkRenderer {
	icon: icon;
	title: title;
	navigationEndpoint: navigationEndpoint;
	trackingParams: string;
}

interface signInEndpoint38 {
	nextEndpoint: navigationEndpoints;
	idamTag: string;
}

interface signalAction {
	signal: string;
}

interface changeEngagementPanelVisibilityAction {
	targetId: string;
	visibility: string;
}

interface multiPageMenuSectionRenderer {
	items: items176[];
	trackingParams: string;
}

interface size {
	sizeType: string;
}

interface rows {
	metadataRowHeaderRenderer: metadataRowHeaderRenderer;
}

interface subscriptionButton {
	type: string;
}

interface sections {
	multiPageMenuSectionRenderer: multiPageMenuSectionRenderer;
}

interface metadataRowHeaderRenderer {
	content: title;
	hasDividerLine: boolean;
}

interface continuationEndpoint {
	clickTrackingParams: string;
	commandMetadata: commandMetadata;
	continuationCommand: continuationCommand;
}

interface atrUrl {
	baseUrl: string;
	elapsedMediaTimeSeconds: number;
}

interface continuationCommand {
	token: string;
	request: string;
}

interface topbarMenuButtonRenderer {
	icon: icon;
	menuRenderer?: menuRenderer180;
	trackingParams: string;
	accessibility: accessibility;
	tooltip: string;
	style: string;
	targetId?: string;
	menuRequest?: serviceEndpoint;
}

interface engagementPanelSectionListRenderer {
	content: {
		adsEngagementPanelContentRenderer: signInEndpoint;
	} | {
		structuredDescriptionContentRenderer: {
			items: {
				expandableVideoDescriptionBodyRenderer: {
					descriptionBodyText: description;
					showMoreText: viewCount;
					showLessText: viewCount;
				};
			}[];
		};
	};
	targetId: string;
	visibility: string;
	loggingDirectives: loggingDirectives;
	panelIdentifier?: string;
	header?: {
		engagementPanelTitleHeaderRenderer: {
			title: viewCount;
			visibilityButton: button;
			trackingParams: string;
		};
	};
	veType?: number;
}

interface multiPageMenuRenderer {
	sections?: sections[];
	trackingParams: string;
	style: string;
	showLoadingSpinner?: boolean;
}

interface responseContext {
	serviceTrackingParams: serviceTrackingParams[];
	mainAppWebResponseContext: mainAppWebResponseContext;
	webResponseContextExtensionData: webResponseContextExtensionData;
}

interface unifiedSharePanelRenderer {
	trackingParams: string;
	showLoadingSpinner: boolean;
}

interface videoCountText {
	runs: runs[];
}

interface engagementPanels {
	engagementPanelSectionListRenderer: engagementPanelSectionListRenderer;
}

interface contents80 {
	continuationItemRenderer: continuationItemRenderer;
}

interface visibility {
	types: string;
}

interface popup {
	unifiedSharePanelRenderer: unifiedSharePanelRenderer;
}

interface menuRenderer180 {
	multiPageMenuRenderer: multiPageMenuRenderer;
}

interface topbarButtons {
	topbarMenuButtonRenderer: topbarMenuButtonRenderer;
}

interface description {
	runs: runs[];
}

interface shareEntityServiceEndpoint {
	serializedShareEntity: string;
	commands: commands[];
}

interface mainAppWebResponseContext {
	loggedOut: boolean;
}

interface subscribeEndpoint {
	channelIds: string[];
	params: string;
}

interface entityBatchUpdate {
	mutations: mutations[];
	timestamp: timestamp;
}

interface loggingDirectives {
	trackingParams: string;
	visibility: visibility;
}

interface frameworkUpdates {
	entityBatchUpdate: entityBatchUpdate;
}

interface signInEndpoint {
	hack: boolean;
}

interface thumbnailText {
	runs: runs[];
}

interface timestamp {
	seconds: string;
	nanos: number;
}

interface continuationItemRenderer {
	trigger: string;
	continuationEndpoint: continuationEndpoint;
	button?: button;
}

interface webResponseContextExtensionData {
	ytConfigData?: {
		visitorData: string;
		rootVisualElementType: number;
	};
	webPrefetchData?: {
		navigationEndpoints: navigationEndpoints[];
	};
	hasDecorated: boolean;
}

interface toggleButtonSupportedData {
	toggleButtonIdData: toggleButtonIdData;
}

interface toggleButtonIdData {
	id: string;
}

interface mutations {
	entityKey: string;
	type: string;
	options?: {
		persistenceOption: string;
	};
	payload?: {
		offlineabilityEntity: {
			key: string;
			addToOfflineButtonState: string;
		};
	};
}

interface FinalData {
	initialData: {
		responseContext: responseContext;
		contents: {
			twoColumnWatchNextResults: {
				results: {
					results: {
						contents: [
							{
								videoPrimaryInfoRenderer: {
									title: title;
									viewCount: {
										videoViewCountRenderer: {
											viewCount: viewCount;
											shortViewCount: viewCount;
										};
									};
									videoActions: videoActions;
									trackingParams: string;
									dateText: viewCount;
								};
							},
							{
								videoSecondaryInfoRenderer: {
									owner: {
										videoOwnerRenderer: {
											thumbnail: thumbnail;
											title: title;
											subscriptionButton: subscriptionButton;
											navigationEndpoint: navigationEndpoint;
											subscriberCountText: defaultText;
											trackingParams: string;
											badges: badges[];
										};
									};
									description: description;
									subscribeButton: button;
									metadataRowContainer: {
										metadataRowContainerRenderer: {
											rows: Array<rows | {
												metadataRowRenderer: {
													title: viewCount;
													contents: viewCount[];
													trackingParams: string;
													hasDividerLine: boolean;
												};
											}>;
											collapsedItemCount: number;
											trackingParams: string;
										};
									};
									showMoreText: viewCount;
									showLessText: viewCount;
									trackingParams: string;
									defaultExpanded: boolean;
									descriptionCollapsedLines: number;
									showMoreCommand: showMoreCommand;
									showLessCommand: commands;
								};
							},
							{
								itemSectionRenderer: {
									contents: contents80[];
									trackingParams: string;
									sectionIdentifier: string;
									targetId: string;
								};
							}
						];
						trackingParams: string;
					};
				};
				secondaryResults: {
					secondaryResults: {
						results: Array<contents80 | results107 | {
							compactRadioRenderer: {
								playlistId: string;
								thumbnail: thumbnail;
								title: viewCount;
								navigationEndpoint: navigationEndpoints;
								videoCountText: title;
								secondaryNavigationEndpoint: navigationEndpoints;
								shortBylineText: viewCount;
								longBylineText: viewCount;
								trackingParams: string;
								thumbnailText: thumbnailText;
								videoCountShortText: title;
								shareUrl: string;
								thumbnailOverlays: [
									{
										thumbnailOverlayBottomPanelRenderer: {
											icon: icon;
										};
									},
									{
										thumbnailOverlayHoverTextRenderer: {
											text: title;
											icon: icon;
										};
									},
									thumbnailOverlays105
								];
							};
						}>;
						trackingParams: string;
						targetId: string;
					};
				};
				playlist: {
					playlist: {
						title: string;
						contents: Array<contents119 | {
							messageRenderer: {
								trackingParams: string;
								subtext: {
									messageSubtextRenderer: {
										text: viewCount;
									};
								};
							};
						}>;
						currentIndex: number;
						playlistId: string;
						totalVideos: number;
						ownerName: viewCount;
						isInfinite: boolean;
						playlistShareUrl: string;
						shortBylineText: title;
						longBylineText: title;
						totalVideosText: thumbnailText;
						trackingParams: string;
						titleText: title;
						endpoint: navigationEndpoint;
						localCurrentIndex: number;
						playlistButtons: videoActions;
						saveButton: topLevelButtons;
						videoCountText: videoCountText;
						isCourse: boolean;
					};
				};
				autoplay: {
					autoplay: {
						sets: sets[];
						modifiedSets: modifiedSets[];
						trackingParams: string;
					};
				};
			};
		};
		currentVideoEndpoint: navigationEndpoints;
		trackingParams: string;
		playerOverlays: {
			playerOverlayRenderer: {
				endScreen: {
					watchNextEndScreenRenderer: {
						results: Array<results137 | {
							endScreenPlaylistRenderer: {
								playlistId: string;
								title: viewCount;
								thumbnail: thumbnail;
								longBylineText: viewCount;
								videoCountText: title;
								navigationEndpoint: navigationEndpoints;
								trackingParams: string;
							};
						}>;
						title: viewCount;
						trackingParams: string;
					};
				};
				shareButton: button;
				addToMenu: videoActions;
				videoDetails: {
					playerOverlayVideoDetailsRenderer: {
						title: viewCount;
						subtitle: videoCountText;
					};
				};
				decoratedPlayerBarRenderer: {
					decoratedPlayerBarRenderer: {};
				};
			};
		};
		overlay: {
			tooltipRenderer: {
				promoConfig: {
					promoId: string;
					impressionEndpoints: impressionEndpoints[];
					acceptCommand: impressionEndpoints;
					dismissCommand: impressionEndpoints;
				};
				targetId: string;
				text: title;
				detailsText: title;
				dismissButton: button;
				suggestedPosition: subscriptionButton;
				dismissStrategy: subscriptionButton;
				dwellTimeMs: string;
				trackingParams: string;
			};
		};
		onResponseReceivedEndpoints: serviceEndpoint[];
		engagementPanels: engagementPanels[];
		topbar: {
			desktopTopbarRenderer: {
				logo: {
					topbarLogoRenderer: {
						iconImage: icon;
						tooltipText: title;
						endpoint: navigationEndpoint;
						trackingParams: string;
						overrideEntityKey: string;
					};
				};
				searchbox: {
					fusionSearchboxRenderer: {
						icon: icon;
						placeholderText: title;
						config: {
							webSearchboxConfig: {
								requestLanguage: string;
								requestDomain: string;
								hasOnscreenKeyboard: boolean;
								focusSearchbox: boolean;
							};
						};
						trackingParams: string;
						searchEndpoint: {
							clickTrackingParams: string;
							commandMetadata: commandMetadata;
							searchEndpoint: {
								query: string;
							};
						};
						clearButton: button;
					};
				};
				trackingParams: string;
				topbarButtons: [
					topbarButtons,
					topbarButtons,
					button
				];
				hotkeyDialog: {
					hotkeyDialogRenderer: {
						title: title;
						sections: sections187[];
						dismissButton: button;
						trackingParams: string;
					};
				};
				backButton: button;
				forwardButton: button;
				a11ySkipNavigationButton: button;
				voiceSearchButton: button;
			};
		};
		frameworkUpdates: frameworkUpdates;
	};
	initialPlayerResponse: {
		responseContext: responseContext;
		playabilityStatus: {
			status: string;
			playableInEmbed: boolean;
			miniplayer: {
				miniplayerRenderer: {
					playbackMode: string;
				};
			};
			contextParams: string;
		};
		streamingData: {
			expiresInSeconds: string;
			formats: {
				itag: number;
				mimeType: string;
				bitrate: number;
				width: number;
				height: number;
				lastModified: string;
				contentLength: string;
				quality: string;
				fps: number;
				qualityLabel: string;
				projectionType: string;
				averageBitrate: number;
				audioQuality: string;
				approxDurationMs: string;
				audioSampleRate: string;
				audioChannels: number;
				signatureCipher: string;
			}[];
			adaptiveFormats: adaptiveFormats[];
		};
		playerAds: {
			playerLegacyDesktopWatchAdsRenderer: {
				playerAdParams: {
					enabledEngageTypes: string;
				};
			};
		}[];
		playbackTracking: {
			videostatsPlaybackUrl: videostatsPlaybackUrl;
			videostatsDelayplayUrl: videostatsPlaybackUrl;
			videostatsWatchtimeUrl: videostatsPlaybackUrl;
			ptrackingUrl: videostatsPlaybackUrl;
			qoeUrl: videostatsPlaybackUrl;
			atrUrl: atrUrl;
			videostatsScheduledFlushWalltimeSeconds: number[];
			videostatsDefaultFlushIntervalSeconds: number;
			youtubeRemarketingUrl: atrUrl;
			googleRemarketingUrl: atrUrl;
		};
		videoDetails: {
			videoId: string;
			title: string;
			lengthSeconds: string;
			keywords: string[];
			channelId: string;
			isOwnerViewing: boolean;
			shortDescription: string;
			isCrawlable: boolean;
			thumbnail: thumbnail;
			allowRatings: boolean;
			viewCount: string;
			author: string;
			isPrivate: boolean;
			isUnpluggedCorpus: boolean;
			isLiveContent: boolean;
		};
		playerConfig: {
			audioConfig: {
				loudnessDb: number;
				perceptualLoudnessDb: number;
				enablePerFormatLoudness: boolean;
			};
			streamSelectionConfig: {
				maxBitrate: string;
			};
			mediaCommonConfig: {
				dynamicReadaheadConfig: {
					maxReadAheadMediaTimeMs: number;
					minReadAheadMediaTimeMs: number;
					readAheadGrowthRateMs: number;
				};
			};
			webPlayerConfig: {
				webPlayerActionsPorting: {
					getSharePanelCommand: {
						clickTrackingParams: string;
						commandMetadata: commandMetadata;
						webPlayerShareEntityServiceEndpoint: {
							serializedShareEntity: string;
						};
					};
					subscribeCommand: {
						clickTrackingParams: string;
						commandMetadata: commandMetadata;
						subscribeEndpoint: subscribeEndpoint;
					};
					unsubscribeCommand: {
						clickTrackingParams: string;
						commandMetadata: commandMetadata;
						unsubscribeEndpoint: subscribeEndpoint;
					};
					addToWatchLaterCommand: untoggledServiceEndpoint;
					removeFromWatchLaterCommand: untoggledServiceEndpoint;
				};
			};
		};
		storyboards: {
			playerStoryboardSpecRenderer: {
				spec: string;
			};
		};
		microformat: {
			playerMicroformatRenderer: {
				thumbnail: channelThumbnail;
				embed: {
					iframeUrl: string;
					flashUrl: string;
					width: number;
					height: number;
					flashSecureUrl: string;
				};
				title: viewCount;
				description: viewCount;
				lengthSeconds: string;
				ownerProfileUrl: string;
				externalChannelId: string;
				isFamilySafe: boolean;
				availableCountries: string[];
				isUnlisted: boolean;
				hasYpcMetadata: boolean;
				viewCount: string;
				category: string;
				publishDate: string;
				ownerChannelName: string;
				uploadDate: string;
			};
		};
		trackingParams: string;
		attestation: {
			playerAttestationRenderer: {
				challenge: string;
				botguardData: {
					program: string;
					interpreterSafeUrl: {
						privateDoNotAccessOrElseTrustedResourceUrlWrappedValue: string;
					};
					serverEnvironment: number;
				};
			};
		};
		messages: {
			mealbarPromoRenderer: {
				messageTexts: title[];
				actionButton: button;
				dismissButton: button;
				triggerCondition: string;
				style: string;
				trackingParams: string;
				impressionEndpoints: impressionEndpoints[];
				isVisible: boolean;
				messageTitle: title;
			};
		}[];
		adPlacements: {
			adPlacementRenderer: {
				config: {
					adPlacementConfig: {
						kind: string;
						adTimeOffset: {
							offsetStartMilliseconds: string;
							offsetEndMilliseconds: string;
						};
						hideCueRangeMarker: boolean;
					};
				};
				renderer: {
					adBreakServiceRenderer: {
						prefetchMilliseconds: string;
						getAdBreakUrl: string;
					};
				};
			};
		}[];
		frameworkUpdates: frameworkUpdates;
	};
}

export default FinalData;
