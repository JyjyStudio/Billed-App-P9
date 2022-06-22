import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from '../app/format.js'
import Logout from './Logout.js'

export default class {
	constructor({ document, onNavigate, store, localStorage }) {
		this.document = document
		this.onNavigate = onNavigate
		this.store = store
		const buttonNewBill = document.querySelector('button[data-testid="btn-new-bill"]')
		const iconEye = document.querySelectorAll('div[data-testid="icon-eye"]')
		try {
			buttonNewBill.addEventListener('click', this.handleClickNewBill)
			iconEye.forEach(icon => {
				icon.addEventListener('click', () => this.handleClickIconEye(icon))
			})
		} catch (error) {
			return	
		}
		new Logout({ document, localStorage, onNavigate })
	}

	handleClickNewBill = () => {
		this.onNavigate(ROUTES_PATH['NewBill'])
	}

	handleClickIconEye = (icon) => {
		const billUrl = icon.getAttribute('data-bill-url')
		const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
		$('#modaleFile').find('.modal-body').html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
		$('#modaleFile').modal('show')
	}
	// not need to cover this function by tests
	/* istanbul ignore next */
	getBills = () => {
		if (this.store) {
			return this.store
				.bills()
				.list()
				.then(snapshot => {
					const bills = snapshot.map(doc => {
						try {
							return {
								...doc,
								date: formatDate(doc.date),
								status: formatStatus(doc.status)
							}
						} catch(error) {
							// if for some reason, corrupted data was introduced, we manage here failing formatDate function
							// log the error and return unformatted date in that case
							console.log(error, 'for', doc)
							return {
								...doc,
								date: doc.date,
								status: formatStatus(doc.status)
							}
						}
					}).filter((bill) => bill.vat !== null)
					console.log('bills :>> ', bills)
					return bills
				})
		}
	}
}
