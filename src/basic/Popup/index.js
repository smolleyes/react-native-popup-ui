import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, Alert } from 'react-native'

const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height

class Popup extends Component {
	static popupInstance

	static show({ ...config }) {
		this.popupInstance.start(config)
	}

	static hide() {
		this.popupInstance.hidePopup()
	}

	state = {
		positionView: new Animated.Value(HEIGHT),
		opacity: new Animated.Value(0),
		positionPopup: new Animated.Value(HEIGHT),
		popupHeight: 0,
		headerHeight: 85
	}

	start({ ...config }) {
		this.setState({
			title: config.title,
			type: config.type,
			icon: config.icon !== undefined ? config.icon : false,
			textBody: config.textBody,
			buttons:config.buttons,
			button: config.button !== undefined ? config.button : true,
			buttonText: config.buttonText || 'Ok',
			callback: config.callback !== undefined ? config.callback : this.defaultCallback(),
			background: config.background || 'rgba(0, 0, 0, 0.5)',
			timing: config.timing,
			autoClose: config.autoClose !== undefined ? config.autoClose : false
		})

		Animated.sequence([
			Animated.timing(this.state.positionView, {
				toValue: 0,
				duration: 100,
				useNativeDriver: false
			}),
			Animated.timing(this.state.opacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: false
			}),
			Animated.spring(this.state.positionPopup, {
				toValue: (HEIGHT / 2) - (this.state.popupHeight / 2),
				bounciness: 15,
				useNativeDriver: true
			})
		]).start()

		if (config.autoClose && config.timing !== 0) {
			const duration = config.timing > 0 ? config.timing : 5000
			setTimeout(() => {
				this.hidePopup()
			}, duration)
		}
	}

	hidePopup() {
		Animated.sequence([
			Animated.timing(this.state.positionPopup, {
				toValue: HEIGHT,
				duration: 250,
				useNativeDriver: true
			}),
			Animated.timing(this.state.opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false
			}),
			Animated.timing(this.state.positionView, {
				toValue: HEIGHT,
				duration: 100,
				useNativeDriver: false
			})
		]).start()
	}

	defaultCallback() {
		return Alert.alert(
			'Callback!',
			'Callback complete!',
			[
				{ text: 'Ok', onPress: () => this.hidePopup() }
			]
		)
	}

	handleImage(type) {
		switch (type) {
			case 'success': return require('../../assets/Success.png')
			case 'error': return require('../../assets/Error.png')
			case 'warning': return require('../../assets/Warning.png')
			case 'confirm': return require('../../assets/Confirm.png')
		}
	}

	render() {
		const { title, type, textBody, button, buttonText, callback, background } = this.state
		let el = null;
		if (this.state.buttons && this.state.buttons.length) {
			el = this.state.buttons.map(button => (
				<TouchableOpacity style={[styles.Button, styles[button.type]]} onPress={button.callback}>
					<Text style={styles.TextButton}>{button.text}</Text>
				</TouchableOpacity>
			))
		}
		else {
			el = <Text></Text>
		}
		return (
			<Animated.View
				ref={c => this._root = c}
				style={[styles.Container, {
					backgroundColor: background || 'transparent',
					opacity: this.state.opacity,
					transform: [
						{ translateY: this.state.positionView }
					]
				}]}>
				<Animated.View
					onLayout={event => {
						this.setState({ popupHeight: event.nativeEvent.layout.height })
					}}
					style={[styles.Message, {
						transform: [
							{ translateY: this.state.positionPopup }
						]
					}]}

				>
					<View style={styles.Header} />
					{
						this.state.icon ? (this.state.icon) :
							<Image
								source={this.handleImage(type)}
								resizeMode="contain"
								style={styles.Image}
							/>
					}
					<View style={styles.Content}>
						<Text style={styles.Title}>{title}</Text>
						<Text style={styles.Desc}>{textBody}</Text>
						<Animated.View style={[
            {
							backgroundColor:'transparent',
							transform: [
								{ translateY: this.state.positionView }
							],
							...styles.ButtonsContainer
						},
          ]}>
							{el}
						</Animated.View>
					</View>
				</Animated.View>
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	Container: {
		position: 'absolute',
		zIndex: 99999,
		width: WIDTH,
		height: HEIGHT,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',
		top: 0,
		left: 0
	},
	Message: {
		maxWidth: WIDTH - 10,
		width:WIDTH - 30,
		minHeight: 300,
		backgroundColor: '#fff',
		borderRadius: 30,
		alignItems: 'center',
		overflow: 'hidden',
		position: 'absolute',
	},
	Content: {
		padding: 20,
		alignItems: 'center'
	},
	Header: {
		height: 130,
		width: 230,
		backgroundColor: '#FBFBFB',
		borderRadius: 100,
		marginTop: -120
	},
	Image: {
		width: 150,
		height: 80,
		position: 'absolute',
		top: 20
	},
	Title: {
		fontWeight: 'bold',
		fontSize: 18,
		color: '#333'
	},
	Desc: {
		textAlign: 'center',
		color: '#666',
		marginTop: 10
	},
	ButtonsContainer: {
		alignItems:"stretch",
		width: WIDTH,
		justifyContent:"space-evenly",
		flex:1,
		flexDirection:"row"
	},
	Button: {
		borderRadius: 50,
		height: 40,
		width: 'auto',
		minWidth:100,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 50
	},
	TextButton: {
		color: '#fff',
		fontWeight: 'bold',
		alignSelf: 'stretch',
		textAlign:"center"
	},
	success: {
		backgroundColor: '#AAF577',
		shadowColor: "#AAF577",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.36,
		shadowRadius: 6.68,
		elevation: 11
	},
	error: {
		backgroundColor: '#F29091',
		shadowColor: "#F29091",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.36,
		shadowRadius: 6.68,
		elevation: 11
	},
	confirm:{
		backgroundColor: '#2cf8ff',
		shadowColor: "#2cf8ff",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.36,
		shadowRadius: 6.68,
		elevation: 11
	},
	Warning: {
		backgroundColor: '#fbd10d',
		shadowColor: "#fbd10d",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.36,
		shadowRadius: 6.68,
		elevation: 11
	}
})

export default Popup
