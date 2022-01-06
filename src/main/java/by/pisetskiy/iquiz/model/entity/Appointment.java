package by.pisetskiy.iquiz.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import javax.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Formula;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@SuperBuilder
public class Appointment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ToString.Exclude
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ToString.Exclude
    private Quiz quiz;

    @Enumerated(EnumType.STRING)
    private AppointmentState state;

    @Column(columnDefinition = "DATE")
    private LocalDate deadline;
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime startDate;
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime endDate;

    @Formula("(select count(a.id) from answer a where a.appointment_id = id)")
    private Integer answersCount;
    @Formula("(select count(a.id) from answer a where a.appointment_id = id and a.is_true = 1)")
    private Integer trueAnswersCount;

    @Transient
    public boolean isExpired() {
        return deadline.isBefore(LocalDate.now());
    }

    @Transient
    public boolean isInProcess() {
        return state == AppointmentState.STARTED
                && endDate == null
                && startDate.plusMinutes(quiz.getTimeLimit()).isAfter(LocalDateTime.now());
    }

}
