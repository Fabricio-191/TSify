export interface title {
	runs: runs[];
}

export interface viewCount {
	simpleText: string;
	accessibility?: accessibility;
}

export interface navigationEndpoints {
	clickTrackingParams?: string;
	commandMetadata: commandMetadata;
	watchEndpoint?: {
		videoId: string;
		playlistId?: string;
		index?: number;
		params?: string;
		playerParams?: string;
		loggingContext?: {
			vssLoggingContext: {
				serializedContextData: string;
			};
		};
		watchEndpointSupportedPrefetchConfig?: {
			prefetchHintConfig: {
				prefetchPriority: number;
				playbackRelativeSecondsPrefetchCondition: number;
			};
		};
		watchEndpointSupportedOnesieConfig?: {
			html5PlaybackOnesieConfig: {
				commonConfig: {
					url: string;
				};
			};
		};
		nofollow?: boolean;
		continuePlayback?: boolean;
	};
	signInEndpoint?: signInEndpoint | {
		idamTag: string;
	} | {
		nextEndpoint: navigationEndpoints;
		idamTag: string;
		continueAction?: string;
	};
	modalEndpoint?: {
		modal: {
			modalWithTitleAndButtonRenderer: {
				title: title | viewCount;
				content: title | viewCount;
				button: button;
			};
		};
	};
	browseEndpoint?: {
		browseId: string;
		canonicalBaseUrl?: string;
	};
	urlEndpoint?: {
		url: string;
		target: string;
		nofollow?: boolean;
	};
	continuationCommand?: {
		token: string;
		request: string;
	};
	feedbackEndpoint?: {
		feedbackToken: string;
		uiActions: {
			hideEnclosingContainer: boolean;
		};
	};
}

export interface button {
	buttonRenderer: buttonRenderer;
}

export interface icon {
	iconType: string;
}

export interface serviceEndpoint {
	clickTrackingParams: string;
	commandMetadata: commandMetadata;
	shareEntityServiceEndpoint?: shareEntityServiceEndpoint;
	signalServiceEndpoint?: {
		signal: string;
		actions: [
			{
				clickTrackingParams: string;
				addToPlaylistCommand?: {
					openMiniplayer: boolean;
					openListPanel: boolean;
					videoId: string;
					listType: string;
					onCreateListCommand: {
						clickTrackingParams: string;
						commandMetadata: commandMetadata;
						createPlaylistServiceEndpoint: {
							videoIds: string[];
							params: string;
						};
					};
					videoIds: string[];
				};
				signalAction?: {
					signal: string;
				};
			} | {
				clickTrackingParams: string;
				openPopupAction?: {
					popup: menuRenderer147 | {
						notificationActionRenderer: {
							responseText: title | viewCount;
							trackingParams: string;
						};
					} | {
						unifiedSharePanelRenderer: {
							trackingParams: string;
							showLoadingSpinner: boolean;
						};
					} | {
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
				};
				changeEngagementPanelVisibilityAction?: changeEngagementPanelVisibilityAction;
				scrollToEngagementPanelCommand?: {
					targetId: string;
				};
				updateToggleButtonStateCommand?: {
					toggled: boolean;
					buttonId: string;
				};
			},
			{
				clickTrackingParams: string;
				openPopupAction?: {
					popup: menuRenderer147 | {
						notificationActionRenderer: {
							responseText: title | viewCount;
							trackingParams: string;
						};
					} | {
						unifiedSharePanelRenderer: {
							trackingParams: string;
							showLoadingSpinner: boolean;
						};
					} | {
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
				};
				changeEngagementPanelVisibilityAction?: changeEngagementPanelVisibilityAction;
				scrollToEngagementPanelCommand?: {
					targetId: string;
				};
				updateToggleButtonStateCommand?: {
					toggled: boolean;
					buttonId: string;
				};
			}?
		];
	};
	playlistEditEndpoint?: playlistEditEndpoint;
}

export interface accessibility {
	accessibilityData: accessibilityData;
}

export interface videostatsPlaybackUrl {
	baseUrl: string;
	elapsedMediaTimeSeconds?: number;
}

export interface commandMetadata {
	webCommandMetadata: {
		ignoreNavigation: boolean;
	} | {
		sendPost: boolean;
		apiUrl: string;
	} | {
		sendPost: boolean;
	} | {
		url: string;
		webPageType: string;
		rootVe: number;
		apiUrl?: string;
	};
}

export interface thumbnail {
	thumbnails: {
		url: string;
		width: number;
		height: number;
	}[];
	sampledThumbnailColor?: {
		red: number;
		green: number;
		blue: number;
	};
}

export interface accessibilityData {
	label: title | string;
	hotkey?: string;
	hotkeyAccessibilityLabel?: accessibility;
}

export interface videoActions {
	menuRenderer: menuRenderer;
}

export interface compactVideoRenderer {
	videoId?: string;
	thumbnail?: thumbnail;
	title: title | viewCount;
	longBylineText?: title | viewCount;
	publishedTimeText?: viewCount;
	viewCountText?: viewCount;
	lengthText?: viewCount;
	navigationEndpoint: navigationEndpoints;
	shortBylineText?: title | viewCount;
	channelThumbnail?: thumbnail;
	ownerBadges?: {
		metadataBadgeRenderer: {
			icon?: icon;
			style: string;
			tooltip?: string;
			trackingParams: string;
			accessibilityData?: accessibilityData;
			label?: string;
		};
	}[];
	trackingParams: string;
	shortViewCountText?: viewCount;
	menu?: videoActions;
	thumbnailOverlays?: [
		{
			thumbnailOverlayBottomPanelRenderer: thumbnailOverlayBottomPanelRenderer;
		} | {
			thumbnailOverlayTimeStatusRenderer: runs;
		},
		{
			thumbnailOverlayHoverTextRenderer: thumbnailOverlayBottomPanelRenderer;
		} | {
			thumbnailOverlayNowPlayingRenderer: runs;
		} | {
			thumbnailOverlayToggleButtonRenderer: {
				isToggled?: boolean;
				untoggledIcon: icon;
				toggledIcon: icon;
				untoggledTooltip: string;
				toggledTooltip: string;
				untoggledServiceEndpoint: serviceEndpoint;
				toggledServiceEndpoint?: serviceEndpoint;
				untoggledAccessibility: accessibility;
				toggledAccessibility: accessibility;
				trackingParams: string;
			};
		},
		({
			thumbnailOverlayNowPlayingRenderer: runs;
		} | {
			thumbnailOverlayToggleButtonRenderer: {
				isToggled?: boolean;
				untoggledIcon: icon;
				toggledIcon: icon;
				untoggledTooltip: string;
				toggledTooltip: string;
				untoggledServiceEndpoint: serviceEndpoint;
				toggledServiceEndpoint?: serviceEndpoint;
				untoggledAccessibility: accessibility;
				toggledAccessibility: accessibility;
				trackingParams: string;
			};
		})?,
		{
			thumbnailOverlayNowPlayingRenderer: runs;
		}?
	];
	accessibility?: accessibility;
	playlistId?: string;
	videoCountText?: title;
	secondaryNavigationEndpoint?: navigationEndpoints;
	thumbnailText?: title;
	videoCountShortText?: title;
	shareUrl?: string;
	badges?: {
		metadataBadgeRenderer: {
			icon?: icon;
			style: string;
			tooltip?: string;
			trackingParams: string;
			accessibilityData?: accessibilityData;
			label?: string;
		};
	}[];
	lengthInSeconds?: number;
	icon?: icon;
}

export interface buttonRenderer {
	style?: style | string;
	size?: string | {
		sizeType: string;
	};
	isDisabled?: boolean;
	text?: title | viewCount;
	navigationEndpoint?: navigationEndpoints | serviceEndpoint;
	trackingParams: string;
	isToggled?: boolean;
	defaultIcon?: icon;
	defaultText?: viewCount;
	toggledText?: viewCount;
	accessibility?: accessibility | accessibilityData;
	defaultTooltip?: string;
	toggledTooltip?: string;
	toggledStyle?: style;
	defaultNavigationEndpoint?: navigationEndpoints;
	accessibilityData?: accessibility;
	toggleButtonSupportedData?: {
		toggleButtonIdData: {
			id: string;
		};
	};
	targetId?: string;
	serviceEndpoint?: serviceEndpoint;
	icon?: icon;
	tooltip?: string;
	command?: navigationEndpoints | serviceEndpoint | showMoreCommand;
	defaultServiceEndpoint?: serviceEndpoint;
	toggledServiceEndpoint?: serviceEndpoint;
	toggledIcon?: icon;
	toggledAccessibilityData?: accessibility;
	menuRenderer?: menuRenderer147;
	menuRequest?: serviceEndpoint;
}

export interface menuRenderer {
	items?: {
		menuServiceItemRenderer: menuNavigationItemRenderer;
	}[] | {
		menuNavigationItemRenderer: menuNavigationItemRenderer;
	};
	trackingParams: string;
	topLevelButtons?: Array<button | {
		toggleButtonRenderer: buttonRenderer;
	}>;
	accessibility?: accessibility;
	targetId?: string;
	visibility?: {
		types: string;
	};
	sections?: {
		multiPageMenuSectionRenderer: itemSectionRenderer;
	}[];
	style?: string;
	showLoadingSpinner?: boolean;
}

export interface subscriptionButton {
	type: string;
}

export interface metadataRowHeaderRenderer {
	content?: title;
	hasDividerLine?: boolean;
	title?: viewCount;
	contents?: viewCount[];
	trackingParams?: string;
	rows?: Array<{
		metadataRowHeaderRenderer: metadataRowHeaderRenderer;
	} | {
		metadataRowRenderer: metadataRowHeaderRenderer;
	}>;
	collapsedItemCount?: number;
}

export interface autoplayVideo {
	clickTrackingParams: string;
	commandMetadata: commandMetadata;
	watchPlaylistEndpoint: playlistEditEndpoint;
}

export interface signInEndpoint {
	hack: boolean;
}

export interface responseContext {
	serviceTrackingParams: {
		service: string;
		params: {
			key: string;
			value: string;
		}[];
	}[];
	mainAppWebResponseContext: {
		loggedOut: boolean;
	};
	webResponseContextExtensionData: {
		ytConfigData?: {
			visitorData: string;
			rootVisualElementType: number;
		};
		webPrefetchData?: {
			navigationEndpoints: navigationEndpoints[];
		};
		hasDecorated: boolean;
	};
}

export interface runs {
	text: title | viewCount | string;
	navigationEndpoint?: navigationEndpoints;
	style?: string;
	bold?: boolean;
}

export interface menuNavigationItemRenderer {
	text: title;
	icon: icon;
	navigationEndpoint?: navigationEndpoints;
	trackingParams: string;
	serviceEndpoint?: serviceEndpoint;
}

export interface style {
	styleType: string;
}

export interface shareEntityServiceEndpoint {
	serializedShareEntity: string;
	commands?: {
		clickTrackingParams: string;
		openPopupAction?: {
			popup: menuRenderer147 | {
				notificationActionRenderer: {
					responseText: title | viewCount;
					trackingParams: string;
				};
			} | {
				unifiedSharePanelRenderer: {
					trackingParams: string;
					showLoadingSpinner: boolean;
				};
			} | {
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
		};
		changeEngagementPanelVisibilityAction?: changeEngagementPanelVisibilityAction;
		scrollToEngagementPanelCommand?: {
			targetId: string;
		};
		updateToggleButtonStateCommand?: {
			toggled: boolean;
			buttonId: string;
		};
	}[];
}

export interface videoPrimaryInfoRenderer {
	title?: title;
	viewCount?: {
		videoViewCountRenderer: {
			viewCount: viewCount;
			shortViewCount: viewCount;
		};
	};
	videoActions?: videoActions;
	trackingParams: string;
	dateText?: viewCount;
	owner?: {
		videoOwnerRenderer: {
			thumbnail: thumbnail;
			title: title;
			subscriptionButton: subscriptionButton;
			navigationEndpoint: navigationEndpoints;
			subscriberCountText: viewCount;
			trackingParams: string;
			badges: {
				metadataBadgeRenderer: {
					icon?: icon;
					style: string;
					tooltip?: string;
					trackingParams: string;
					accessibilityData?: accessibilityData;
					label?: string;
				};
			}[];
		};
	};
	description?: title;
	subscribeButton?: button;
	metadataRowContainer?: {
		metadataRowContainerRenderer: metadataRowHeaderRenderer;
	};
	showMoreText?: viewCount;
	showLessText?: viewCount;
	defaultExpanded?: boolean;
	descriptionCollapsedLines?: number;
	showMoreCommand?: showMoreCommand;
	showLessCommand?: {
		clickTrackingParams: string;
		openPopupAction?: {
			popup: menuRenderer147 | {
				notificationActionRenderer: {
					responseText: title | viewCount;
					trackingParams: string;
				};
			} | {
				unifiedSharePanelRenderer: {
					trackingParams: string;
					showLoadingSpinner: boolean;
				};
			} | {
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
		};
		changeEngagementPanelVisibilityAction?: changeEngagementPanelVisibilityAction;
		scrollToEngagementPanelCommand?: {
			targetId: string;
		};
		updateToggleButtonStateCommand?: {
			toggled: boolean;
			buttonId: string;
		};
	};
}

export interface changeEngagementPanelVisibilityAction {
	targetId: string;
	visibility: string;
	content?: {
		adsEngagementPanelContentRenderer: signInEndpoint;
	} | {
		structuredDescriptionContentRenderer: {
			items: {
				expandableVideoDescriptionBodyRenderer: {
					descriptionBodyText: title;
					showMoreText: viewCount;
					showLessText: viewCount;
				};
			}[];
		};
	};
	loggingDirectives?: menuRenderer;
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

export interface showMoreCommand {
	clickTrackingParams: string;
	commandExecutorCommand: {
		commands: navigationEndpoints[] | {
			clickTrackingParams: string;
			openPopupAction?: {
				popup: menuRenderer147 | {
					notificationActionRenderer: {
						responseText: title | viewCount;
						trackingParams: string;
					};
				} | {
					unifiedSharePanelRenderer: {
						trackingParams: string;
						showLoadingSpinner: boolean;
					};
				} | {
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
			};
			changeEngagementPanelVisibilityAction?: changeEngagementPanelVisibilityAction;
			scrollToEngagementPanelCommand?: {
				targetId: string;
			};
			updateToggleButtonStateCommand?: {
				toggled: boolean;
				buttonId: string;
			};
		};
	};
}

export interface itemSectionRenderer {
	contents?: {
		continuationItemRenderer: {
			trigger: string;
			continuationEndpoint: navigationEndpoints;
			button?: button;
		};
	}[];
	trackingParams: string;
	sectionIdentifier?: string;
	targetId?: string;
	items?: {
		compactLinkRenderer: compactVideoRenderer;
	}[];
}

export interface playlistEditEndpoint {
	playlistId: string;
	actions?: {
		action: string;
		removedVideoId: string;
	}[] | {
		addedVideoId: string;
		action: string;
	};
	index?: number;
	params?: string;
}

export interface thumbnailOverlayBottomPanelRenderer {
	icon: icon;
	text?: title;
}

export interface topbarLogoRenderer {
	iconImage?: icon;
	tooltipText?: title;
	endpoint?: navigationEndpoints;
	trackingParams: string;
	overrideEntityKey?: string;
	logo?: {
		topbarLogoRenderer: topbarLogoRenderer;
	};
	searchbox?: {
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
	topbarButtons?: [
		{
			topbarMenuButtonRenderer: buttonRenderer;
		},
		{
			topbarMenuButtonRenderer: buttonRenderer;
		},
		button
	];
	hotkeyDialog?: {
		hotkeyDialogRenderer: hotkeyDialogSectionRenderer;
	};
	backButton?: button;
	forwardButton?: button;
	a11ySkipNavigationButton?: button;
	voiceSearchButton?: button;
}

export interface menuRenderer147 {
	multiPageMenuRenderer: menuRenderer;
}

export interface hotkeyDialogSectionRenderer {
	title: title;
	options?: {
		hotkeyDialogSectionOptionRenderer: accessibilityData;
	}[];
	sections?: {
		hotkeyDialogSectionRenderer: hotkeyDialogSectionRenderer;
	}[];
	dismissButton?: button;
	trackingParams?: string;
}

export interface frameworkUpdates {
	entityBatchUpdate: {
		mutations: {
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
		}[];
		timestamp: {
			seconds: string;
			nanos: number;
		};
	};
}

export interface initRange {
	start: string;
	end: string;
}

export interface subscribeEndpoint {
	channelIds: string[];
	params: string;
}

export interface subscribeCommand {
	clickTrackingParams: string;
	commandMetadata: commandMetadata;
	subscribeEndpoint?: subscribeEndpoint;
	unsubscribeEndpoint?: subscribeEndpoint;
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
								videoPrimaryInfoRenderer: videoPrimaryInfoRenderer;
							},
							{
								videoSecondaryInfoRenderer: videoPrimaryInfoRenderer;
							},
							{
								itemSectionRenderer: itemSectionRenderer;
							}
						];
						trackingParams: string;
					};
				};
				secondaryResults: {
					secondaryResults: {
						results: Array<{
							compactRadioRenderer: compactVideoRenderer;
						} | {
							compactVideoRenderer: compactVideoRenderer;
						} | {
							continuationItemRenderer: {
								trigger: string;
								continuationEndpoint: navigationEndpoints;
								button?: button;
							};
						}>;
						trackingParams: string;
						targetId: string;
					};
				};
				playlist: {
					playlist: {
						title: string;
						contents: {
							playlistPanelVideoRenderer: {
								title: viewCount;
								longBylineText: title;
								thumbnail: thumbnail;
								lengthText: viewCount;
								indexText: viewCount;
								selected: boolean;
								navigationEndpoint: navigationEndpoints;
								videoId: string;
								shortBylineText: title;
								trackingParams: string;
								thumbnailOverlays: [
									{
										thumbnailOverlayTimeStatusRenderer: runs;
									},
									{
										thumbnailOverlayNowPlayingRenderer: runs;
									}
								];
								playlistSetVideoId: string;
							};
						}[];
						currentIndex: number;
						playlistId: string;
						totalVideos: number;
						ownerName: viewCount;
						isInfinite: boolean;
						playlistShareUrl: string;
						shortBylineText: title;
						longBylineText: title;
						totalVideosText: title;
						trackingParams: string;
						titleText: title;
						endpoint: navigationEndpoints;
						localCurrentIndex: number;
						playlistButtons: videoActions;
						saveButton: {
							toggleButtonRenderer: buttonRenderer;
						};
						videoCountText: title;
						isCourse: boolean;
					};
				};
				autoplay: {
					autoplay: {
						sets: {
							mode?: string;
							autoplayVideo: autoplayVideo | navigationEndpoints;
							nextButtonVideo: autoplayVideo | navigationEndpoints;
							previousButtonVideo?: autoplayVideo | navigationEndpoints;
						}[];
						modifiedSets: {
							mode?: string;
							autoplayVideo: autoplayVideo | navigationEndpoints;
							nextButtonVideo: autoplayVideo | navigationEndpoints;
							previousButtonVideo?: autoplayVideo | navigationEndpoints;
						}[];
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
						results: Array<{
							endScreenPlaylistRenderer: {
								playlistId: string;
								title: viewCount;
								thumbnail: thumbnail;
								longBylineText: viewCount;
								videoCountText: title;
								navigationEndpoint: navigationEndpoints;
								trackingParams: string;
							};
						} | {
							endScreenVideoRenderer: compactVideoRenderer;
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
						subtitle: title;
					};
				};
			};
		};
		overlay: {
			tooltipRenderer: {
				promoConfig: {
					promoId: string;
					impressionEndpoints: navigationEndpoints[];
					acceptCommand: navigationEndpoints;
					dismissCommand: navigationEndpoints;
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
		engagementPanels: {
			engagementPanelSectionListRenderer: changeEngagementPanelVisibilityAction;
		}[];
		topbar: {
			desktopTopbarRenderer: topbarLogoRenderer;
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
				width?: number;
				height?: number;
				lastModified: string;
				contentLength: string;
				quality: string;
				fps?: number;
				qualityLabel?: string;
				projectionType: string;
				averageBitrate: number;
				audioQuality?: string;
				approxDurationMs: string;
				audioSampleRate?: string;
				audioChannels?: number;
				signatureCipher: string;
				initRange?: initRange;
				indexRange?: initRange;
				colorInfo?: {
					primaries: string;
					transferCharacteristics: string;
					matrixCoefficients: string;
				};
				highReplication?: boolean;
				loudnessDb?: number;
			}[];
			adaptiveFormats: {
				itag: number;
				mimeType: string;
				bitrate: number;
				width?: number;
				height?: number;
				lastModified: string;
				contentLength: string;
				quality: string;
				fps?: number;
				qualityLabel?: string;
				projectionType: string;
				averageBitrate: number;
				audioQuality?: string;
				approxDurationMs: string;
				audioSampleRate?: string;
				audioChannels?: number;
				signatureCipher: string;
				initRange?: initRange;
				indexRange?: initRange;
				colorInfo?: {
					primaries: string;
					transferCharacteristics: string;
					matrixCoefficients: string;
				};
				highReplication?: boolean;
				loudnessDb?: number;
			}[];
			probeUrl: string;
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
			atrUrl: videostatsPlaybackUrl;
			videostatsScheduledFlushWalltimeSeconds: number[];
			videostatsDefaultFlushIntervalSeconds: number;
			youtubeRemarketingUrl: videostatsPlaybackUrl;
			googleRemarketingUrl: videostatsPlaybackUrl;
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
						webPlayerShareEntityServiceEndpoint: shareEntityServiceEndpoint;
					};
					subscribeCommand: subscribeCommand;
					unsubscribeCommand: subscribeCommand;
					addToWatchLaterCommand: serviceEndpoint;
					removeFromWatchLaterCommand: serviceEndpoint;
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
				thumbnail: thumbnail;
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
				impressionEndpoints: navigationEndpoints[];
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
