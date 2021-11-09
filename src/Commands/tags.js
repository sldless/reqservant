const { SlashCommandBuilder } = require( "@discordjs/builders" );
const {
	MessageEmbed,
	MessageButton,
	MessageActionRow,
	InteractionCollector
} = require( "discord.js" );
const tag = require( "../Database/tag" );

module.exports = {
	data: new SlashCommandBuilder()
		.setName( "tag" )
		.setDescription( "Tags I guess" )
		.addSubcommand( ( sub ) => {
			return sub
				.setName( "create" )
				.setDescription( "Creates a tag I guess" )
				.addStringOption( ( t ) => {
					return t
						.setName( "title" )
						.setDescription( "It kinda needs a title" )
						.setRequired( true );
				} )
				.addStringOption( ( d ) => {
					return d
						.setName( "content" )
						.setDescription( "It can't be empty... or can it?" )
						.setRequired( true );
				} );
		} )
		.addSubcommand( ( sub ) => {
			return sub
				.setName( "info" )
				.setDescription( "Gets info on a tag" )
				.addStringOption( ( t ) => {
					return t.setName( "tag" ).setDescription( "What's the tag?" );
				} );
		} )
		.addSubcommand( ( sub ) => {
			return sub
				.setName( "delete" )
				.setDescription( "Deletes a tag I guess" )
				.addStringOption( ( t ) => {
					return t.setName( "tag" ).setDescription( "What's the tag?" );
				} );
		} )
		.addSubcommand( ( sub ) => {
			return sub
				.setName( "edit" )
				.setDescription( "Edits a tag I guess" )
				.addStringOption( ( t ) => {
					return t.setName( "tag" ).setDescription( "What's the tag?" );
				} )
				.addStringOption( ( d ) => {
					return d.setName( "title" ).setDescription( "New title?" );
				} )
				.addStringOption( ( d ) => {
					return d.setName( "content" ).setDescription( "New content?" );
				} );
		} ).addSubcommand( ( sub ) => {
			return sub
				.setName( "view" )
				.setDescription( "Shows a tag... so cool" )
				.addStringOption( ( t ) => {
					return t.setName( "tag" ).setDescription( "What's the tag?" );
				} );
		} ),

	async run( interaction ) {
		const subcommand = interaction.options.getSubcommand();

		switch ( subcommand ) {
			case "create":
				if ( !interaction.member.roles.cache.has( "887429367544815696" ) ) {
					return interaction.reply( {
						content: "You need to be a staff member to use this!",
						ephemeral: true
					} );
				}

				const title = interaction.options.getString( "title" );
				const content = interaction.options.getString( "content" );

				const document = await tag.findOne( { name: title.toLowerCase() } );

				if ( document ) {
					const errorEmbedOne = new MessageEmbed()
						.setAuthor( "This tag already exists" )
						.setDescription(
							`\`${ title }\` is already in the database. You can overwrite it.\n\nWould you like to overwrite the tag?`
						)
						.setFooter( "You have 15 seconds" )
						.setColor( "#E91E63" );

					const errorActionRowOne = new MessageActionRow().addComponents(
						new MessageButton()
							.setCustomId( "yes" )
							.setLabel( "✓" )
							.setStyle( "SUCCESS" ),
						new MessageButton()
							.setCustomId( "no" )
							.setLabel( "✘" )
							.setStyle( "DANGER" )
					);

					interaction.reply( {
						embeds: [ errorEmbedOne ],
						components: [ errorActionRowOne ]
					} );

					const message = interaction.fetchReply();

					const collector = new InteractionCollector( interaction.client, {
						channel: interaction.channelId,
						componentType: "BUTTON",
						message: message.id
					} );

					collector.on( "collect", async ( c ) => {
						if ( c.user.id !== interaction.user.id ) {
							c.reply( { content: "You can't do that!" } );
						}

						if ( c.customId === "yes" ) {
							await tag.findOneAndUpdate(
								{ name: title.toLowerCase() },
								{
									name: title.toLowerCase(),
									content: content,
									author: interaction.user.id,
									created: Date.now()
								}
							);
							return interaction.editReply( {
								embeds: [],
								components: [],
								content: "Tag updated"
							} );
						} else if ( c.customId === "no" ) {
							return interaction.editReply( {
								embeds: [],
								components: [],
								content: "Tag not updated"
							} );
						}
					} );
					return;
				}

				const doc = new tag( {
					id: Math.ceil( Math.random() * Date.now() * 5 ).toString( 36 ),
					name: title.toLowerCase(),
					content: content,
					author: interaction.user.id,
					created: Date.now(),
					uses: 0
				} );

				await doc.save();

				interaction.reply( {
					content: "Tag created",
					ephemeral: true
				} );
				break;

			case "info":
				const tagThingy = interaction.options.getString( "tag" );

				let documen2;

				if ( tagThingy ) {
					documen2 = await tag.findOne( { name: tagThingy.toLowerCase() } );
				}

				const tags = await tag.find();

				const errorEmbedOne = new MessageEmbed()
					.setAuthor( "Specified Tag doesn't exist." )
					.setDescription(
						`The tag doesn't exist, but these ones do.\n\`\`\`\n${
							tags.length > 0 ? tags.slice( 0, 10 ).map( ( t ) => t.name ).join( ", " ) : "None do but, you can make one by using /tag create"
						}\`\`\``
					)
					.setColor( "#3498DB" );

				const errorActionRowTwo = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId( "nopers" )
						.setLabel( "✘" )
						.setStyle( "DANGER" ),
					new MessageButton()
						.setCustomId( "back" )
						.setLabel( "◀" )
						.setStyle( "PRIMARY" ),
					new MessageButton()
						.setCustomId( "next" )
						.setLabel( "►" )
						.setStyle( "PRIMARY" )
				);

				if ( !tags.length ) {
					errorActionRowTwo.components.forEach( ( c ) => c.disabled = true );
					errorActionRowTwo.components[ 0 ].disabled = false;
				}

				const infoEmbed = new MessageEmbed();

				const infoActionRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId( "quit" )
						.setLabel( "✘" )
						.setStyle( "DANGER" ),
					new MessageButton()
						.setCustomId( "exit" )
						.setLabel( "↵" )
						.setStyle( "DANGER" ),
					new MessageButton()
						.setCustomId( "back" )
						.setLabel( "◀" )
						.setStyle( "PRIMARY" ),
					new MessageButton()
						.setCustomId( "next" )
						.setLabel( "►" )
						.setStyle( "PRIMARY" )
				);

				let t = 0;

				if ( !tagThingy || !documen2 ) {

					interaction.reply( {
						embeds: [ errorEmbedOne ],
						components: [ errorActionRowTwo ]
					} );

					const input = new InteractionCollector( interaction.client, {
						channel: interaction.channelId,
						componentType: "BUTTON",
						message: interaction.fetchReply().id
					} );

					input.on( "collect", ( c ) => {
						if ( c.user.id !== interaction.user.id ) {
							c.reply( { content: "You can't do that!" } );
						}

						if ( c.customId === "nopers" || c.customId === "quit" ) {
							interaction.deleteReply();
						} else if ( c.customId === "next" ) {
							if ( t === tags.length - 1 ) t = 0;
							else t++;

							documen2 = tags[ t ];

							c.deferUpdate();

							interaction.editReply( {
								embeds: [ infoEmbed.setAuthor( documen2.name ).setDescription( `> **Author**: <@${
									documen2.author
								}>\n> **Created**: **<t:${ Math.floor(
									parseInt( documen2.created ) / 1000
								) }:R>**\n> **Uses**: **${ documen2.uses }**` ).setColor( "#3498DB" ) ],
								components: [ infoActionRow ]
							} );

						} else if ( c.customId === "back" ) {
							if ( t === 0 ) t = tags.length - 1;
							else t--;

							documen2 = tags[ t ];

							c.deferUpdate();

							interaction.editReply( {
								embeds: [ infoEmbed.setAuthor( documen2.name ).setDescription( `> **Author**: <@${
									documen2.author
								}>\n> **Created**: **<t:${ Math.floor(
									parseInt( documen2.created ) / 1000
								) }:R>**\n> **Uses**: **${ documen2.uses }**` ).setColor( "#3498DB" ) ],
								components: [ infoActionRow ]
							} );

						} else if ( c.customId === "exit" ) {
							c.deferUpdate();

							interaction.editReply( {
								embeds: [ errorEmbedOne ],
								components: [ errorActionRowTwo ]
							} );

							const input2 = new InteractionCollector( interaction.client, {
								channel: interaction.channelId,
								componentType: "BUTTON",
								message: interaction.fetchReply().id
							} );

							input2.on( "collect", ( c ) => {
								if ( c.user.id !== interaction.user.id ) {
									c.reply( { content: "You can't do that!" } );
								}

								if ( c.customId === "nopers" ) {
									interaction.deleteReply();
								}
							} );
						}
					} );

					return;
				}

				interaction.reply( {
					embeds: [ infoEmbed.setAuthor( documen2.name ).setDescription( `> **Author**: <@${
						documen2.author
					}>\n> **Created**: **<t:${ Math.floor(
						parseInt( documen2.created ) / 1000
					) }:R>**\n> **Uses**: **${ documen2.uses }**` ).setColor( "#3498DB" ) ],
					components: [ infoActionRow ]
				} );

				const input = new InteractionCollector( interaction.client, {
					channel: interaction.channelId,
					componentType: "BUTTON",
					message: interaction.fetchReply().id
				} );

				let i = 0;

				input.on( "collect", ( c ) => {
					if ( c.user.id !== interaction.user.id ) {
						c.reply( { content: "You can't do that!" } );
					}

					if ( c.customId === "quit" ) {
						interaction.deleteReply();
					} else if ( c.customId === "exit" ) {
						c.deferUpdate();

						interaction.editReply( {
							embeds: [ errorEmbedOne ],
							components: [ errorActionRowTwo ]
						} );

						const input2 = new InteractionCollector( interaction.client, {
							channel: interaction.channelId,
							componentType: "BUTTON",
							message: interaction.fetchReply().id
						} );

						input2.on( "collect", ( c ) => {
							if ( c.user.id !== interaction.user.id ) {
								c.reply( { content: "You can't do that!" } );
							}

							if ( c.customId === "nopers" ) {
								interaction.deleteReply();
							}
						} );
					} else if ( c.customId === "next" ) {
						if ( i === tags.length - 1 ) i = 0;
						else i++;

						documen2 = tags[ i ];

						c.deferUpdate();

						interaction.editReply( {
							embeds: [ infoEmbed.setAuthor( documen2.name ).setDescription( `> **Author**: <@${
								documen2.author
							}>\n> **Created**: **<t:${ Math.floor(
								parseInt( documen2.created ) / 1000
							) }:R>**\n> **Uses**: **${ documen2.uses }**` ).setColor( "#3498DB" ) ],
							components: [ infoActionRow ]
						} );

					} else if ( c.customId === "back" ) {
						if ( i === 0 ) i = tags.length - 1;
						else i--;

						documen2 = tags[ i ];

						c.deferUpdate();

						interaction.editReply( {
							embeds: [ infoEmbed.setAuthor( documen2.name ).setDescription( `> **Author**: <@${
								documen2.author
							}>\n> **Created**: **<t:${ Math.floor(
								parseInt( documen2.created ) / 1000
							) }:R>**\n> **Uses**: **${ documen2.uses }**` ).setColor( "#3498DB" ) ],
							components: [ infoActionRow ]
						} );

					}
				} );

				break;

			case "delete": {
				if ( !interaction.member.roles.cache.has( "887429367544815696" ) ) {
					return interaction.reply( {
						content: "You need to be a staff member to use this!",
						ephemeral: true
					} );
				}

				const tagThingy = interaction.options.getString( "tag" );

				if ( tagThingy && tag.findOne( { name: tagThingy.toLowerCase() } ) ) {
					await tag.findOneAndRemove( { name: tagThingy.toLowerCase() } );
					interaction.reply( { content: "Tag deleted", ephemeral: true } );
					return;
				}

				const tags = await tag.find();

				const errorEmbedThree = new MessageEmbed()
					.setAuthor( "Specified Tag doesn't exist." )
					.setDescription(
						`The tag doesn't exist, but these ones do.\n\`\`\`\n${
							tags.length > 0 ? tags.slice( 0, 10 ).map( ( t ) => t.name ).join( ", " ) : "No tags yet"
						}\`\`\``
					)
					.setColor( "#3498DB" );

				const errorActionRowThree = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId( "nopersers" )
						.setLabel( "✘" )
						.setStyle( "DANGER" ),
					new MessageButton()
						.setCustomId( "behindwards" )
						.setLabel( "◀" )
						.setStyle( "PRIMARY" ),
					new MessageButton()
						.setCustomId( "frontwards" )
						.setLabel( "►" )
						.setStyle( "PRIMARY" )
				);

				if ( !tags.length ) {
					errorActionRowThree.components.forEach( ( c ) => c.disabled = true );
					errorActionRowThree.components[ 0 ].disabled = false;
				}

				const infoEmbed = new MessageEmbed();

				const infoActionRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId( "delete" )
						.setLabel( "✓" )
						.setStyle( "SUCCESS" ),
					new MessageButton()
						.setCustomId( "behindwards" )
						.setLabel( "◀" )
						.setStyle( "PRIMARY" ),
					new MessageButton()
						.setCustomId( "frontwards" )
						.setLabel( "►" )
						.setStyle( "PRIMARY" )
				);

				interaction.reply( { embeds: [ errorEmbedThree ], components: [ errorActionRowThree ] } );

				const input = new InteractionCollector( interaction.client, {
					channel: interaction.channelId,
					componentType: "BUTTON",
					message: interaction.fetchReply().id
				} );

				let dt = 0;

				input.on( "collect", async ( d ) => {
						if ( d.user.id !== interaction.user.id ) {
							d.reply( { content: "You can't do that!" } );
						}

						if ( d.customId === "nopersers" ) {
							interaction.deleteReply();
						} else if ( d.customId === "frontwards" ) {
							if ( dt === tags.length - 1 ) dt = 0;
							else dt++;

							d.deferUpdate();

							interaction.editReply( {
								embeds: [ infoEmbed.setAuthor( `Delete ${ tags[ dt ].name }?` ).setColor( "#E91E63" ) ],
								components: [ infoActionRow ]
							} );
						} else if ( d.customId === "behindwards" ) {
							if ( dt === 0 ) dt = tags.length - 1;
							else dt--;

							d.deferUpdate();

							interaction.editReply( {
								embeds: [ infoEmbed.setAuthor( `Delete ${ tags[ dt ].name }?` ).setColor( "#E91E63" ) ],
								components: [ infoActionRow ]
							} );
						} else if ( d.customId === "delete" ) {
							await tag.findOneAndRemove( { name: tags[ dt ].name } );
							await interaction.editReply( { content: "Tag deleted", ephemeral: true, embeds: [], components: [] } );
						}
					}
				);

				break;
			}

			case "edit": {
				if ( !interaction.member.roles.cache.has( "887429367544815696" ) ) {
					return interaction.reply( {
						content: "You need to be a staff member to use this!",
						ephemeral: true
					} );
				}

				const tagThingy = interaction.options.getString( "tag" );
				const title = interaction.options.getString( "title" );
				const content = interaction.options.getString( "content" );

				if ( tagThingy && content && title && await tag.findOne( { name: tagThingy.toLowerCase() } ) ) {

					const leTags = await tag.findOne( { name: tagThingy.toLowerCase() } );

					leTags.content = content;
					leTags.name = title.toLowerCase().split()[ 0 ].toLowerCase();

					await leTags.save();

					return interaction.reply( { content: "Tag updated", ephemeral: true } );
				} else if ( tagThingy && title && await tag.findOne( { name: tagThingy.toLowerCase() } ) ) {

					const thingy = await tag.findOne( { name: tagThingy.toLowerCase() } );

					thingy.name = title.toLowerCase().split()[ 0 ].toLowerCase();

					await thingy.save();

					return interaction.reply( { content: "Tag updated", ephemeral: true } );
				} else if ( tagThingy && content && await tag.findOne( { name: tagThingy.toLowerCase() } ) ) {

					const another = await tag.findOne( { name: tagThingy.toLowerCase() } );

					another.content = content;

					await another.save();

					return interaction.reply( { content: "Tag updated", ephemeral: true } );
				}

				const tags = await tag.find();

				const errorEmbedFour = new MessageEmbed()
					.setAuthor( "Specified Tag doesn't exist." )
					.setDescription(
						`The tag doesn't exist, but these ones do.\n\`\`\`\n${
							tags.length > 0 ? tags.slice( 0, 10 ).map( ( t ) => t.name ).join( ", " ) : "No tags yet"
						}\`\`\``
					)
					.setColor( "#3498DB" );

				const errorActionRowFour = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId( "nopersersers" )
						.setLabel( "✘" )
						.setStyle( "DANGER" ),
					new MessageButton()
						.setCustomId( "behindwardss" )
						.setLabel( "◀" )
						.setStyle( "PRIMARY" ),
					new MessageButton()
						.setCustomId( "frontwardss" )
						.setLabel( "►" )
						.setStyle( "PRIMARY" )
				);

				if ( !tags.length ) {
					errorActionRowFour.components.forEach( ( c ) => c.disabled = true );
					errorActionRowFour.components[ 0 ].disabled = false;
				}

				const fancyEmbed = new MessageEmbed();

				const fancyRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId( "select" )
						.setLabel( "✓" )
						.setStyle( "SUCCESS" ),
					new MessageButton()
						.setCustomId( "behindwardss" )
						.setLabel( "◀" )
						.setStyle( "PRIMARY" ),
					new MessageButton()
						.setCustomId( "frontwardss" )
						.setLabel( "►" )
						.setStyle( "PRIMARY" )
				);

				const fancyRowTwo = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId( "name" )
						.setLabel( "Name" )
						.setStyle( "PRIMARY" ),
					new MessageButton()
						.setCustomId( "content" )
						.setLabel( "Content" )
						.setStyle( "PRIMARY" ),
					new MessageButton()
						.setCustomId( "both" )
						.setLabel( "Both" )
						.setStyle( "PRIMARY" )
				);

				if ( !tagThingy || tagThingy && !tag.findOne( { name: tagThingy.toLowerCase() } ) ) {
					interaction.reply( { embeds: [ errorEmbedFour ], components: [ errorActionRowFour ] } );

					const input = new InteractionCollector( interaction.client, {
						channel: interaction.channelId,
						componentType: "BUTTON",
						message: interaction.fetchReply().id
					} );

					let te = 0;

					input.on( "collect", ( c ) => {
							if ( c.user.id !== interaction.user.id ) {
								c.reply( { content: "You can't do that!" } );
							}

							const filter = m => m.author.id === interaction.user.id;

							if ( c.customId === "nopersersers" ) {
								interaction.deleteReply();
							} else if ( c.customId === "frontwardss" ) {
								if ( te === tags.length - 1 ) te = 0;
								else te++;

								c.deferUpdate();

								interaction.editReply( {
									embeds: [ fancyEmbed.setAuthor( `Edit ${ tags[ te ].name }?` ).setColor( "#F1C40F" ) ],
									components: [ fancyRow ]
								} );

							} else if ( c.customId === "behindwardss" ) {
								if ( te === 0 ) te = tags.length - 1;
								else te--;

								c.deferUpdate();

								interaction.editReply( {
									embeds: [ fancyEmbed.setAuthor( `Edit ${ tags[ te ].name }?` ).setColor( "#F1C40F" ) ],
									components: [ fancyRow ]
								} );
							} else if ( c.customId === "select" ) {
								c.deferUpdate();

								interaction.editReply( {
									embeds: [ fancyEmbed.setAuthor( tags[ te ].name ).setDescription( "Pick out of three parameters\n\n`Name` - `Content` - `Both`" ).setColor( "#F1C40F" ) ],
									components: [ fancyRowTwo ]
								} );
							} else if ( c.customId === "name" ) {
								interaction.editReply( {
									embeds: [ fancyEmbed.setAuthor( tags[ te ].name ).setDescription( "Now specify a name" ).setColor( "#F1C40F" ) ],
									components: []
								} );

								let tries = 3;
								const collector = interaction.channel.createMessageCollector( { filter, time: 15000, max: 3 } );

								collector.on( "collect", async ( c ) => {
									const content = c.content.split();

									if ( content[ 1 ] ) {
										tries--;
										c.reply( { content: `You have \`${ tries }\` tries left`, ephemeral: true } );
										c.delete();
										return;
									}

									const doc = await tag.findOneAndUpdate( { name: tags[ te ].name }, { name: c.content.split()[ 0 ] } );
									await doc.save();

									interaction.editReply( {
										embeds: [ fancyEmbed.setAuthor( c.content.split()[ 0 ] ).setDescription( `\`${ tags[ te ].name }\` was updated to \`${ c.content.split()[ 0 ] }\`` ).setColor( "#F1C40F" ) ],
										components: []
									} );

									c.delete();

									collector.stop();
								} );
							} else if ( c.customId === "content" ) {
								interaction.editReply( {
									embeds: [ fancyEmbed.setAuthor( tags[ te ].name ).setDescription( `The current content is \`${ tags[ te ].content }\`\n\nNow I need the new content` ).setColor( "#F1C40F" ) ],
									components: []
								} );

								const collector = interaction.channel.createMessageCollector( { filter, time: 15000, max: 3 } );

								collector.on( "collect", async ( c ) => {
									await tag.findOneAndUpdate( { name: tags[ te ].name }, { content: c.content } );

									interaction.editReply( {
										embeds: [ fancyEmbed.setAuthor( tags[ te ].name ).setDescription( `\`${ tags[ te ].content }\` was updated to \`${ c.content }\`` ).setColor( "#F1C40F" ) ],
										components: []
									} );

									c.delete();

									collector.stop();
								} );
							} else if ( c.customId === "both" ) {
								interaction.editReply( {
									embeds: [ fancyEmbed.setAuthor( tags[ te ].name ).setDescription( `The current name is \`${ tags[ te ].name }\`\n\nNow I need a new one.` ).setColor( "#F1C40F" ) ],
									components: []
								} );

								const collector = interaction.channel.createMessageCollector( { filter, time: 15000, max: 3 } );

								let triesAgain = 3;

								collector.on( "collect", async ( c ) => {
										const content = c.content.split();

										if ( content[ 1 ] ) {
											triesAgain--;
											await c.reply( { content: `You have \`${ triesAgain }\` tries left`, ephemeral: true } );
											await c.delete();
											return;
										}

										await tag.findOneAndUpdate( { name: tags[ te ].name }, { name: c.content.split()[ 0 ] } );

										collector.stop();

										const name = c.content.split()[ 0 ];

										await interaction.editReply( {
											embeds: [ fancyEmbed.setAuthor( tags[ te ].name ).setDescription( `> Name: \`${ c.content.split()[ 0 ] }\`\n\nThe current content is \`${ tags[ te ].content }\`\n\nNow I need the new content` ).setColor( "#F1C40F" ) ],
											components: []
										} );

										await c.delete();

										const collector2 = interaction.channel.createMessageCollector( { filter, time: 15000, max: 3 } );

										collector2.on( "collect", async ( c ) => {
											await tag.findOneAndUpdate( { name: name }, { content: c.content } );

											await interaction.editReply( {
												embeds: [ fancyEmbed.setAuthor( name ).setDescription( `\`${ name }\` was successfully updated` ).setColor( "#F1C40F" ) ],
												components: []
											} );

											await c.delete();

											collector2.stop();
										} );
									}
								);
							}
						}
					);
				}
				break;
			}

			case "view": {
				const tagThingy = interaction.options.getString( "tag" );

				if ( !tagThingy || tagThingy && !tag.findOne( { name: tagThingy.toLowerCase() } ) ) {
					const tags = await tag.find();

					interaction.reply( {
						embeds: [ new MessageEmbed()
							.setAuthor( "Specified Tag doesn't exist." )
							.setDescription(
								`The tag doesn't exist, but these ones do.\n\`\`\`\n${
									tags.length > 0 ? tags.slice( 0, 10 ).map( ( t ) => t.name ).join( ", " ) : "No tags yet"
								}\`\`\``
							)
							.setColor( "#3498DB" ) ]
					} );

					return;
				}

				const doc = await tag.findOne( { name: tagThingy.toLowerCase() } );

				interaction.reply( {
					embeds: [ new MessageEmbed()
						.setAuthor( doc.name )
						.setDescription(
							doc.content
						)
						.setColor( "#3498DB" ) ]
				} );

				doc.uses++;
				await doc.save();
			}
		}
	}
};
