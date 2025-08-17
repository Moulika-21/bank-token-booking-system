package com.banktoken.dto;

public class SlotDTO {
	private String slotTime;
	private boolean booked;
	
	public SlotDTO(String slotTime, boolean booked) {
		this.slotTime=slotTime;
		this.booked=booked;
	}
	public String getSlotTime() {
		return slotTime;
	}
	public void setSlotTime(String slotTime) {
		this.slotTime = slotTime;
	}
	public void setBooked(boolean booked) {
		this.booked = booked;
	}
	public boolean isBooked() {
		return booked;
	}
}
