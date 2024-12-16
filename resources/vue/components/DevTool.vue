<script setup>
import { useScheduleStore } from '@/store/ScheduleStore';

const scheduleStore = useScheduleStore();
</script>

<template>
  <div class=" bg-white p-5 border-[1px] border-black absolute top-[25px] left-[25px] text-black z-[50] flex ">
    <div class="w-full h-full relative">

    
      
      <div>
        <div>
          <h2 class=" font-bold text-[20px]">Price Information</h2>
          Ticket {{ scheduleStore?.priceTotalNewAsmat?.total_ticket_price ?? 0 }} <br>
          Insurance {{ scheduleStore?.priceTotalNewAsmat?.insurance_rates ?? 0 }} <br>

          <template v-if="scheduleStore.appliedVoucher">
            Voucher {{ scheduleStore.voucherData.deduction_nominal }} ({{ scheduleStore.appliedVoucher }}) <br>
          </template>

          <template v-else>
            Voucher 0
          </template>
          

          <br>
          Total Price {{ scheduleStore?.priceTotalNewAsmat?.total_price ?? 0 }} 
        </div>

      </div>

      <!-- <div class="w-[50px] h-[50px] rounded-full bg-[red] text-white absolute right-[-100px] top-0 flex justify-center items-center">
        X
      </div> -->
    </div>
  </div>
  <!-- <div class="w-[30px] h-[90px] bg-[red] absolute top-[100px] left-0 z-[50]"></div> -->
</template>